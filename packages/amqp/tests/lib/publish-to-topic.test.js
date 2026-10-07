'use strict';

const EventEmitter = require('events');

jest.mock('@idearium/log', () => {
    const logger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn() };

    return jest.fn(() => logger);
});

jest.mock('amqplib', () => ({ connect: jest.fn() }));

const amqp = require('amqplib');
const createLog = require('@idearium/log');
const publishToTopic = require('../../lib/publish-to-topic');

const log = createLog();

const buildChannel = () => {
    const channel = new EventEmitter();

    channel.assertExchange = jest.fn().mockResolvedValue();
    channel.publish = jest.fn((exchange, routingKey, content, options, cb) => {
        cb(null);
    });

    return channel;
};

const buildConnection = ({ channel }) => {
    const connection = new EventEmitter();

    connection.createConfirmChannel = jest.fn().mockResolvedValue(channel);
    connection.close = jest.fn().mockResolvedValue();

    return connection;
};

const originalMqUrl = process.env.MQ_URL;

afterEach(() => {
    jest.clearAllMocks();

    if (originalMqUrl === undefined) {
        delete process.env.MQ_URL;
    } else {
        process.env.MQ_URL = originalMqUrl;
    }
});

describe('validation', () => {
    it('rejects when exchange is missing', async () => {
        await expect(
            publishToTopic({
                mqUrl: 'amqp://mq',
                payload: {},
                routingKey: 'key',
            }),
        ).rejects.toThrow('The exchange parameter must be provided');
    });

    it('rejects when payload is missing', async () => {
        await expect(
            publishToTopic({
                exchange: 'ex',
                mqUrl: 'amqp://mq',
                routingKey: 'key',
            }),
        ).rejects.toThrow('The payload parameter must be provided');
    });

    it('rejects when routingKey is missing', async () => {
        await expect(
            publishToTopic({
                exchange: 'ex',
                mqUrl: 'amqp://mq',
                payload: {},
            }),
        ).rejects.toThrow('The routingKey parameter must be provided');
    });

    it('rejects when mqUrl is missing and MQ_URL is unset', async () => {
        delete process.env.MQ_URL;

        await expect(
            publishToTopic({
                exchange: 'ex',
                payload: {},
                routingKey: 'key',
            }),
        ).rejects.toThrow('The mqUrl parameter is required');
    });
});

describe('connection', () => {
    it('defaults mqUrl to process.env.MQ_URL', async () => {
        process.env.MQ_URL = 'amqp://from-env';

        const channel = buildChannel();
        const connection = buildConnection({ channel });

        amqp.connect.mockResolvedValueOnce(connection);

        await publishToTopic({
            exchange: 'ex',
            payload: {},
            routingKey: 'key',
        });

        expect(amqp.connect).toHaveBeenCalledWith('amqp://from-env', undefined);
    });

    it('forwards socketOptions to amqp.connect', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        amqp.connect.mockResolvedValueOnce(connection);

        await publishToTopic({
            exchange: 'ex',
            mqUrl: 'amqp://mq',
            payload: {},
            routingKey: 'key',
            socketOptions: { ca: 'ca', cert: 'cert', key: 'key' },
        });

        expect(amqp.connect).toHaveBeenCalledWith('amqp://mq', {
            ca: 'ca',
            cert: 'cert',
            key: 'key',
        });
    });

    it('propagates an amqp.connect rejection without closing', async () => {
        amqp.connect.mockRejectedValueOnce(new Error('connect failed'));

        await expect(
            publishToTopic({
                exchange: 'ex',
                mqUrl: 'amqp://mq',
                payload: {},
                routingKey: 'key',
            }),
        ).rejects.toThrow('connect failed');

        expect(amqp.connect).toHaveBeenCalledTimes(1);
    });
});

describe('publishing', () => {
    it('asserts a durable topic exchange and publishes with confirmation', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        amqp.connect.mockResolvedValueOnce(connection);

        await publishToTopic({
            exchange: 'test-exchange',
            mqUrl: 'amqp://mq',
            payload: { hello: 'world' },
            routingKey: 'test-routing-key',
        });

        expect(connection.createConfirmChannel).toHaveBeenCalledTimes(1);
        expect(channel.assertExchange).toHaveBeenCalledWith(
            'test-exchange',
            'topic',
            { durable: true },
        );
        expect(channel.publish).toHaveBeenCalledWith(
            'test-exchange',
            'test-routing-key',
            Buffer.from(JSON.stringify({ hello: 'world' })),
            { deliveryMode: 2, mandatory: true },
            expect.any(Function),
        );
        expect(connection.close).toHaveBeenCalledTimes(1);
    });

    it('propagates an assertExchange rejection', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        amqp.connect.mockResolvedValueOnce(connection);
        channel.assertExchange.mockRejectedValueOnce(
            new Error('assert failed'),
        );

        await expect(
            publishToTopic({
                exchange: 'ex',
                mqUrl: 'amqp://mq',
                payload: {},
                routingKey: 'key',
            }),
        ).rejects.toThrow('assert failed');

        expect(channel.publish).not.toHaveBeenCalled();
        expect(connection.close).toHaveBeenCalledTimes(1);
    });

    it('propagates a nacked confirm callback', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        amqp.connect.mockResolvedValueOnce(connection);
        channel.publish.mockImplementation(
            (exchange, routingKey, content, options, cb) => {
                cb(new Error('message nacked'));
            },
        );

        await expect(
            publishToTopic({
                exchange: 'ex',
                mqUrl: 'amqp://mq',
                payload: {},
                routingKey: 'key',
            }),
        ).rejects.toThrow('message nacked');

        expect(connection.close).toHaveBeenCalledTimes(1);
    });
});

describe('unroutable messages', () => {
    it('rejects when a mandatory message is returned unroutable', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        amqp.connect.mockResolvedValueOnce(connection);
        channel.publish.mockImplementation(
            (exchange, routingKey, content, options, cb) => {
                channel.emit('return', {
                    fields: {
                        replyCode: 312,
                        replyText: 'No route',
                        routingKey,
                    },
                });

                cb(null);
            },
        );

        await expect(
            publishToTopic({
                exchange: 'ex',
                mqUrl: 'amqp://mq',
                payload: {},
                routingKey: 'key',
            }),
        ).rejects.toThrow('MQ message returned unroutable: ex key');

        expect(log.error).toHaveBeenCalledWith(
            expect.objectContaining({
                replyCode: 312,
                replyText: 'No route',
            }),
            'MQ message returned',
        );
        expect(connection.close).toHaveBeenCalledTimes(1);
    });

    it('resolves when a non-mandatory message is returned unroutable', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        amqp.connect.mockResolvedValueOnce(connection);
        channel.publish.mockImplementation(
            (exchange, routingKey, content, options, cb) => {
                channel.emit('return', {
                    fields: {
                        replyCode: 312,
                        replyText: 'No route',
                        routingKey,
                    },
                });

                cb(null);
            },
        );

        await publishToTopic({
            exchange: 'ex',
            mandatory: false,
            mqUrl: 'amqp://mq',
            payload: {},
            routingKey: 'key',
        });

        expect(channel.publish).toHaveBeenCalledWith(
            'ex',
            'key',
            expect.any(Buffer),
            { deliveryMode: 2, mandatory: false },
            expect.any(Function),
        );
        expect(log.error).toHaveBeenCalledWith(
            expect.anything(),
            'MQ message returned',
        );
    });
});

describe('error-event safety', () => {
    it('logs and does not throw when the channel emits error', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        amqp.connect.mockResolvedValueOnce(connection);
        channel.publish.mockImplementation(
            (exchange, routingKey, content, options, cb) => {
                channel.emit('error', new Error('channel error'));

                cb(null);
            },
        );

        await publishToTopic({
            exchange: 'ex',
            mqUrl: 'amqp://mq',
            payload: {},
            routingKey: 'key',
        });

        expect(log.warn).toHaveBeenCalledWith(
            expect.objectContaining({ err: expect.any(Error) }),
            'MQ channel error',
        );
        expect(connection.close).toHaveBeenCalledTimes(1);
    });

    it('logs and does not throw when the connection emits error', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        amqp.connect.mockResolvedValueOnce(connection);
        connection.createConfirmChannel.mockImplementation(async () => {
            connection.emit('error', new Error('connection error'));

            return channel;
        });

        await publishToTopic({
            exchange: 'ex',
            mqUrl: 'amqp://mq',
            payload: {},
            routingKey: 'key',
        });

        expect(log.warn).toHaveBeenCalledWith(
            expect.objectContaining({ err: expect.any(Error) }),
            'MQ connection error',
        );
    });

    it('surfaces a failure solely through rejection when it both rejects and emits', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        amqp.connect.mockResolvedValueOnce(connection);
        channel.assertExchange.mockImplementation(() => {
            channel.emit('error', new Error('channel error'));

            return Promise.reject(new Error('assert failed'));
        });

        await expect(
            publishToTopic({
                exchange: 'ex',
                mqUrl: 'amqp://mq',
                payload: {},
                routingKey: 'key',
            }),
        ).rejects.toThrow('assert failed');

        expect(log.warn).toHaveBeenCalledWith(
            expect.anything(),
            'MQ channel error',
        );
    });
});

describe('connection close', () => {
    it('resolves when close fails, logging a warning', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        amqp.connect.mockResolvedValueOnce(connection);
        connection.close.mockRejectedValueOnce(new Error('close failed'));

        await publishToTopic({
            exchange: 'ex',
            mqUrl: 'amqp://mq',
            payload: {},
            routingKey: 'key',
        });

        expect(log.warn).toHaveBeenCalledWith(
            expect.objectContaining({ err: expect.any(Error) }),
            'MQ connection close failed',
        );
    });
});
