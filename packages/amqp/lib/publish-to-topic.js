'use strict';

const amqp = require('amqplib');
const log = require('@idearium/log')();

const publishToTopic = async ({
    exchange,
    mandatory = true,
    mqUrl = process.env.MQ_URL,
    payload,
    routingKey,
    socketOptions,
}) => {
    if (!exchange) {
        throw new Error('The exchange parameter must be provided');
    }

    if (!mqUrl) {
        throw new Error('The mqUrl parameter is required');
    }

    if (payload === undefined) {
        throw new Error('The payload parameter must be provided');
    }

    if (routingKey === undefined) {
        throw new Error('The routingKey parameter must be provided');
    }

    const connection = await amqp.connect(mqUrl, socketOptions);

    // amqplib emits 'error' on the connection and channel for failures
    // that already reject the operation promises; without a listener
    // Node treats the emission as an uncaught exception and crashes.
    connection.on('error', (err) => {
        log.warn({ err }, 'MQ connection error');
    });

    try {
        const channel = await connection.createConfirmChannel();
        let returned = false;

        channel.on('error', (err) => {
            log.warn({ err, exchange }, 'MQ channel error');
        });

        channel.on('return', (msg) => {
            returned = true;

            log.error(
                {
                    exchange,
                    replyCode: msg.fields.replyCode,
                    replyText: msg.fields.replyText,
                    routingKey: msg.fields.routingKey,
                },
                'MQ message returned',
            );
        });

        await channel.assertExchange(exchange, 'topic', {
            durable: true,
        });

        await new Promise((resolve, reject) => {
            channel.publish(
                exchange,
                routingKey,
                Buffer.from(JSON.stringify(payload)),
                { deliveryMode: 2, mandatory },
                (err) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve();
                },
            );
        });

        if (mandatory && returned) {
            throw new Error(
                `MQ message returned unroutable: ${exchange} ${routingKey}`,
            );
        }

        log.debug({ exchange, routingKey }, 'MQ message published');
    } finally {
        await connection
            .close()
            .catch((err) => log.warn({ err }, 'MQ connection close failed'));
    }
};

module.exports = publishToTopic;
