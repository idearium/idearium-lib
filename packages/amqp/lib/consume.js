import createLog from '@idearium/log';
import createMultiLog from '@idearium/log/multi';

const log = createLog();
const multiLog = createMultiLog();

export const consumeFactory = ({ session }) => {
    const consume = async ({
        consumer,
        durable = true,
        exchange,
        name,
        noAck = false,
        queue,
        routingKey,
        type = 'topic',
    }) => {
        if (!name) {
            throw new Error('The name parameter must be provided');
        }

        if (!consumer) {
            throw new Error('The consumer parameter must be provided');
        }

        if (!exchange) {
            throw new Error('The exchange parameter must be provided');
        }

        if (!queue) {
            throw new Error('The queue parameter must be provided');
        }

        if (routingKey === undefined) {
            throw new Error('The routingKey parameter must be provided');
        }

        await session.exchange(exchange, type, { durable });
        const q = await session.queue(queue, { durable });
        await q.bind(exchange, routingKey);

        const subscription = await q.subscribe({ noAck }, async (msg) => {
            try {
                let data = msg.body;

                if (msg.body instanceof Uint8Array) {
                    data = JSON.parse(Buffer.from(msg.body).toString());
                }

                if (!Array.isArray(data)) {
                    data = [data];
                }

                multiLog(
                    {
                        debug: { data, type },
                        info: { exchange, name, queue, routingKey },
                    },
                    'Consuming a message',
                );

                await consumer(data);
            } catch (err) {
                log.error(
                    { err, exchange, name, queue, routingKey, type },
                    'An error occurred while processing a message',
                );

                throw err;
            }
        });

        log.info({ name, type }, 'Setup consumer');

        return { name, subscription };
    };

    return { consume };
};
