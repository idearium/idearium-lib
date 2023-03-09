const log = require('@idearium/log')();
const multiLog = require('@idearium/log/multi')();
const publishingChannels = require('./lib/publish');
const connect = require('./lib/connect');

const amqpUrl = process.env.MQ_URL;

const amqp = async (mqUrl = amqpUrl, opts = {}) => {
    const connection = await connect(mqUrl, opts);
    const channels = publishingChannels(connection);

    const consume = async (name, consumer, options) => {
        if (!name) {
            throw new Error('The name parameter must be provided');
        }

        if (!consumer) {
            throw new Error('The consumer parameter must be provided');
        }

        if (!options) {
            throw new Error('The options parameter must be provided');
        }

        if (!connection.isConnected()) {
            throw new Error(
                'You must connect to a server before using consume'
            );
        }

        const {
            autoAck = true,
            durable = true,
            exchange,
            queue,
            noAck = false,
            routingKey,
            type = 'topic',
        } = options;

        const channel = await connection.createChannel();
        await channel.assertExchange(exchange, type, {
            durable,
        });
        await channel.assertQueue(queue, { durable });
        await channel.bindQueue(queue, exchange, routingKey);
        await channel.consume(
            queue,
            async (msg) => {
                try {
                    let data = JSON.parse(msg.content.toString());

                    if (!Array.isArray(data)) {
                        data = [data];
                    }

                    multiLog(
                        {
                            debug: { data, type },
                            info: { exchange, name, queue, routingKey },
                        },
                        'Consuming a message'
                    );

                    await consumer(data);
                } catch (err) {
                    log.error(
                        { err, exchange, name, queue, routingKey, type },
                        'An error occurred while processing a message'
                    );
                }

                if (autoAck === true) {
                    channel.ack(msg);
                }
            },
            { noAck }
        );

        log.info({ name, type }, 'Setup consumer');

        return { channel, consumer, options, name };
    };

    const publish = async (name, data, options) => {
        if (!connection.isConnected()) {
            throw new Error(
                'You must connect to a server before using publish'
            );
        }

        channels.publish(name, data, options);
    };

    return {
        consume,
        publish,
    };
};

module.exports = amqp;
