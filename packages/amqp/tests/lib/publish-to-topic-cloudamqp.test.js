'use strict';

jest.mock('@idearium/log', () => {
    const logger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn() };

    return jest.fn(() => logger);
});

jest.mock('amqplib', () => {
    const err = new Error("Cannot find module 'amqplib'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
});

jest.mock('@cloudamqp/amqp-client', () => ({
    AMQPClient: jest.fn(),
}));

const { AMQPClient } = require('@cloudamqp/amqp-client');
const createLog = require('@idearium/log');
const publishToTopic = require('../../lib/publish-to-topic');

const log = createLog();

const buildChannel = () => ({
    confirmSelect: jest.fn().mockResolvedValue(),
    exchangeDeclare: jest.fn().mockResolvedValue(),
    basicPublish: jest.fn().mockResolvedValue(),
});

const buildConnection = ({ channel }) => ({
    channel: jest.fn().mockResolvedValue(channel),
    close: jest.fn().mockResolvedValue(),
});

const wireClient = ({ connection }) => {
    AMQPClient.mockImplementation(() => ({
        connect: jest.fn().mockResolvedValue(connection),
    }));
};

afterEach(() => {
    jest.clearAllMocks();
});

describe('connection', () => {
    it('constructs the client with mqUrl and socketOptions', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        wireClient({ connection });

        await publishToTopic({
            exchange: 'ex',
            mqUrl: 'amqp://mq',
            payload: {},
            routingKey: 'key',
            socketOptions: { ca: 'ca', cert: 'cert', key: 'key' },
        });

        expect(AMQPClient).toHaveBeenCalledWith('amqp://mq', {
            ca: 'ca',
            cert: 'cert',
            key: 'key',
        });
    });

    it('defaults socketOptions to undefined when not provided', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        wireClient({ connection });

        await publishToTopic({
            exchange: 'ex',
            mqUrl: 'amqp://mq',
            payload: {},
            routingKey: 'key',
        });

        expect(AMQPClient).toHaveBeenCalledWith('amqp://mq', undefined);
    });
});

describe('publishing', () => {
    it('confirms the channel, declares a durable topic exchange, and publishes', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        wireClient({ connection });

        await publishToTopic({
            exchange: 'test-exchange',
            mqUrl: 'amqp://mq',
            payload: { hello: 'world' },
            routingKey: 'test-routing-key',
        });

        expect(channel.confirmSelect).toHaveBeenCalledTimes(1);
        expect(channel.confirmSelect.mock.invocationCallOrder[0]).toBeLessThan(
            channel.basicPublish.mock.invocationCallOrder[0],
        );
        expect(channel.exchangeDeclare).toHaveBeenCalledWith(
            'test-exchange',
            'topic',
            { durable: true },
        );
        expect(channel.basicPublish).toHaveBeenCalledWith(
            'test-exchange',
            'test-routing-key',
            Buffer.from(JSON.stringify({ hello: 'world' })),
            { deliveryMode: 2 },
            true,
        );
        expect(connection.close).toHaveBeenCalledTimes(1);
    });

    it('passes mandatory as the fifth positional argument when false', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        wireClient({ connection });

        await publishToTopic({
            exchange: 'ex',
            mandatory: false,
            mqUrl: 'amqp://mq',
            payload: {},
            routingKey: 'key',
        });

        expect(channel.basicPublish).toHaveBeenCalledWith(
            'ex',
            'key',
            expect.any(Buffer),
            { deliveryMode: 2 },
            false,
        );
    });

    it('propagates an exchangeDeclare rejection', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        wireClient({ connection });
        channel.exchangeDeclare.mockRejectedValueOnce(
            new Error('declare failed'),
        );

        await expect(
            publishToTopic({
                exchange: 'ex',
                mqUrl: 'amqp://mq',
                payload: {},
                routingKey: 'key',
            }),
        ).rejects.toThrow('declare failed');

        expect(channel.basicPublish).not.toHaveBeenCalled();
        expect(connection.close).toHaveBeenCalledTimes(1);
    });

    it('propagates a basicPublish rejection', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        wireClient({ connection });
        channel.basicPublish.mockRejectedValueOnce(new Error('message nacked'));

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

        wireClient({ connection });
        channel.basicPublish.mockImplementationOnce(async () => {
            channel.onReturn({
                replyCode: 312,
                replyText: 'No route',
                routingKey: 'key',
            });
        });

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

        wireClient({ connection });
        channel.basicPublish.mockImplementationOnce(async () => {
            channel.onReturn({
                replyCode: 312,
                replyText: 'No route',
                routingKey: 'key',
            });
        });

        await publishToTopic({
            exchange: 'ex',
            mandatory: false,
            mqUrl: 'amqp://mq',
            payload: {},
            routingKey: 'key',
        });

        expect(log.error).toHaveBeenCalledWith(
            expect.anything(),
            'MQ message returned',
        );
        expect(connection.close).toHaveBeenCalledTimes(1);
    });
});

describe('error-callback safety', () => {
    it('assigns onerror functions that log without throwing', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        wireClient({ connection });

        await publishToTopic({
            exchange: 'ex',
            mqUrl: 'amqp://mq',
            payload: {},
            routingKey: 'key',
        });

        expect(typeof connection.onerror).toBe('function');
        expect(typeof channel.onerror).toBe('function');
        expect(typeof channel.onReturn).toBe('function');

        expect(() => channel.onerror(new Error('channel error'))).not.toThrow();
        expect(log.warn).toHaveBeenCalledWith(
            expect.objectContaining({ err: expect.any(Error) }),
            'MQ channel error',
        );

        expect(() =>
            connection.onerror(new Error('connection error')),
        ).not.toThrow();
        expect(log.warn).toHaveBeenCalledWith(
            expect.objectContaining({ err: expect.any(Error) }),
            'MQ connection error',
        );
    });
});

describe('connection close', () => {
    it('resolves when close fails, logging a warning', async () => {
        const channel = buildChannel();
        const connection = buildConnection({ channel });

        wireClient({ connection });
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
