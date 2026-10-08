'use strict';

const log = require('@idearium/log')();

const MISSING_CLIENT_ERROR =
    'The publishToTopic function requires either amqplib or @cloudamqp/amqp-client to be installed';

const isModuleNotFound = (err) => err.code === 'MODULE_NOT_FOUND';

let adapter = null;

const amqplibAdapter = ({ amqplib }) => ({
    connect: async ({ mqUrl, socketOptions }) => {
        const connection = await amqplib.connect(mqUrl, socketOptions);

        connection.on('error', (err) => {
            log.warn({ err }, 'MQ connection error');
        });

        return connection;
    },
    createChannel: async ({ connection, onReturn }) => {
        const channel = await connection.createConfirmChannel();

        channel.on('error', (err) => {
            log.warn({ err }, 'MQ channel error');
        });

        channel.on('return', (msg) => onReturn(msg.fields));

        return channel;
    },
    declareExchange: ({ channel, exchange }) =>
        channel.assertExchange(exchange, 'topic', { durable: true }),
    publish: ({ channel, exchange, mandatory, payload, routingKey }) =>
        new Promise((resolve, reject) => {
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
        }),
});

const cloudamqpAdapter = ({ amqpClient }) => ({
    connect: async ({ mqUrl, socketOptions }) => {
        const connection = await new amqpClient(mqUrl, socketOptions).connect();

        connection.onerror = (err) => {
            log.warn({ err }, 'MQ connection error');
        };

        return connection;
    },
    createChannel: async ({ connection, onReturn }) => {
        const channel = await connection.channel();

        await channel.confirmSelect();

        channel.onerror = (err) => {
            log.warn({ err }, 'MQ channel error');
        };

        channel.onReturn = (msg) => onReturn(msg);

        return channel;
    },
    declareExchange: ({ channel, exchange }) =>
        channel.exchangeDeclare(exchange, 'topic', { durable: true }),
    publish: ({ channel, exchange, mandatory, payload, routingKey }) =>
        channel.basicPublish(
            exchange,
            routingKey,
            Buffer.from(JSON.stringify(payload)),
            { deliveryMode: 2 },
            mandatory,
        ),
});

const loadAdapter = () => {
    if (adapter) {
        return adapter;
    }

    try {
        adapter = amqplibAdapter({ amqplib: require('amqplib') });

        return adapter;
    } catch (err) {
        if (!isModuleNotFound(err)) {
            throw err;
        }
    }

    try {
        adapter = cloudamqpAdapter({
            amqpClient: require('@cloudamqp/amqp-client').AMQPClient,
        });

        return adapter;
    } catch (err) {
        if (!isModuleNotFound(err)) {
            throw err;
        }
    }

    throw new Error(MISSING_CLIENT_ERROR);
};

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

    const { connect, createChannel, declareExchange, publish } = loadAdapter();

    const connection = await connect({ mqUrl, socketOptions });

    let returned = false;

    const onReturn = ({
        replyCode,
        replyText,
        routingKey: returnedRoutingKey,
    }) => {
        returned = true;

        log.error(
            {
                exchange,
                replyCode,
                replyText,
                routingKey: returnedRoutingKey,
            },
            'MQ message returned',
        );
    };

    try {
        const channel = await createChannel({ connection, onReturn });

        await declareExchange({ channel, exchange });

        await publish({ channel, exchange, mandatory, payload, routingKey });

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
