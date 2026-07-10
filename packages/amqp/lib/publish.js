import createMultiLog from '@idearium/log/multi';

const multiLog = createMultiLog();

export const publishFactory = ({ session }) => {
    const publish = async ({
        data,
        durable = true,
        exchange,
        routingKey,
        type = 'topic',
    }) => {
        if (!exchange) {
            throw new Error('The exchange parameter must be provided');
        }

        if (data === undefined) {
            throw new Error('The data parameter must be provided');
        }

        const x = await session.exchange(exchange, type, { durable });

        multiLog(
            {
                debug: { data, type },
                info: { exchange, routingKey },
            },
            'Publishing a message',
        );

        await x.publish(data, { routingKey });
    };

    return { publish };
};
