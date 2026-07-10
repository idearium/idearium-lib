import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/connect.js', () => ({
    connect: vi.fn(),
}));
vi.mock('@idearium/log', () => ({
    default: () => ({
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
    }),
}));
vi.mock('@idearium/log/multi', () => ({
    default: () => vi.fn(),
}));

import { connect } from '../lib/connect.js';
import { createClient, createConsumer } from '../index.js';

const createMockSession = () => {
    const mockExchange = {
        publish: vi.fn().mockResolvedValue(),
    };
    const subscription = { cancel: vi.fn(), consumerTag: 'tag-1' };
    const mockQueue = {
        bind: vi.fn().mockResolvedValue(),
        subscribe: vi.fn().mockResolvedValue(subscription),
    };

    const session = {
        exchange: vi.fn().mockResolvedValue(mockExchange),
        queue: vi.fn().mockResolvedValue(mockQueue),
        stop: vi.fn(),
    };

    return { mockExchange, mockQueue, session, subscription };
};

describe('createClient', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();
    });

    it('returns { consume, publish, session, stop }', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        const client = await createClient({ mqUrl: 'amqps://host:5671/' });

        expect(client).toHaveProperty('consume');
        expect(client).toHaveProperty('publish');
        expect(client).toHaveProperty('session');
        expect(client).toHaveProperty('stop');
        expect(typeof client.consume).toBe('function');
        expect(typeof client.publish).toBe('function');
        expect(typeof client.stop).toBe('function');
    });

    it('exposes session as the instance returned by connect', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        const client = await createClient({ mqUrl: 'amqps://host:5671/' });

        expect(client.session).toBe(session);
    });

    it('calls connect with { mqUrl, tlsOptions, ...sessionOptions }', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        await createClient({ mqUrl: 'amqps://host:5671/' });

        expect(connect).toHaveBeenCalledWith({
            mqUrl: 'amqps://host:5671/',
            tlsOptions: undefined,
        });
    });

    it('forwards tlsOptions to connect', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        const tlsOptions = { key: 'k', cert: 'c', ca: 'ca' };

        await createClient({ mqUrl: 'amqps://host:5671/', tlsOptions });

        expect(connect).toHaveBeenCalledWith({
            mqUrl: 'amqps://host:5671/',
            tlsOptions,
        });
    });

    it('forwards extra sessionOptions to connect', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        await createClient({
            mqUrl: 'amqps://host:5671/',
            maxRetries: 5,
            reconnectInterval: 3000,
        });

        expect(connect).toHaveBeenCalledWith({
            mqUrl: 'amqps://host:5671/',
            tlsOptions: undefined,
            maxRetries: 5,
            reconnectInterval: 3000,
        });
    });

    it('calls session.stop() when stop() is invoked', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        const client = await createClient({ mqUrl: 'amqps://host:5671/' });

        client.stop('test reason');

        expect(session.stop).toHaveBeenCalledWith('test reason');
    });

    it('delegates consume to consumeFactory with the session', async () => {
        const { session, subscription } = createMockSession();
        connect.mockResolvedValue(session);

        const client = await createClient({ mqUrl: 'amqps://host:5671/' });

        const result = await client.consume({
            consumer: vi.fn(),
            exchange: 'ex',
            name: 'test',
            queue: 'q',
            routingKey: 'rk',
        });

        expect(session.exchange).toHaveBeenCalledWith('ex', 'topic', {
            durable: true,
        });
        expect(session.queue).toHaveBeenCalledWith('q', { durable: true });
        expect(result).toEqual({ name: 'test', subscription });
    });

    it('delegates publish to publishFactory with the session', async () => {
        const { mockExchange, session } = createMockSession();
        connect.mockResolvedValue(session);

        const client = await createClient({ mqUrl: 'amqps://host:5671/' });

        const data = { key: 'value' };

        await client.publish({ data, exchange: 'ex', routingKey: 'rk' });

        expect(mockExchange.publish).toHaveBeenCalledWith(data, {
            routingKey: 'rk',
        });
    });

    it('supports multiple independent consumers on the same client', async () => {
        const { session, subscription } = createMockSession();
        connect.mockResolvedValue(session);

        const client = await createClient({ mqUrl: 'amqps://host:5671/' });

        const result1 = await client.consume({
            consumer: vi.fn(),
            exchange: 'ex1',
            name: 'c1',
            queue: 'q1',
            routingKey: 'rk1',
        });

        const result2 = await client.consume({
            consumer: vi.fn(),
            exchange: 'ex2',
            name: 'c2',
            queue: 'q2',
            routingKey: 'rk2',
        });

        expect(result1.name).toBe('c1');
        expect(result2.name).toBe('c2');
        expect(session.exchange).toHaveBeenCalledTimes(2);
        expect(session.queue).toHaveBeenCalledTimes(2);
    });

    it('forwards process.env.MQ_URL when mqUrl is omitted', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        vi.stubEnv('MQ_URL', 'amqps://envhost:5671/');

        await createClient({});

        expect(connect).toHaveBeenCalledWith(
            expect.objectContaining({
                mqUrl: undefined,
                tlsOptions: undefined,
            }),
        );
    });
});

describe('createConsumer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();
    });

    it('returns { name, subscription, stop }', async () => {
        const { session, subscription } = createMockSession();
        connect.mockResolvedValue(session);

        const result = await createConsumer({
            consumer: vi.fn(),
            exchange: 'ex',
            name: 'my-consumer',
            queue: 'q',
            routingKey: 'rk',
            mqUrl: 'amqps://host:5671/',
        });

        expect(result).toHaveProperty('name', 'my-consumer');
        expect(result).toHaveProperty('subscription', subscription);
        expect(result).toHaveProperty('stop');
        expect(typeof result.stop).toBe('function');
    });

    it('name matches the name parameter', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        const result = await createConsumer({
            consumer: vi.fn(),
            exchange: 'ex',
            name: 'custom-name',
            queue: 'q',
            routingKey: 'rk',
            mqUrl: 'amqps://host:5671/',
        });

        expect(result.name).toBe('custom-name');
    });

    it('calls session.stop() when stop() is invoked', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        const result = await createConsumer({
            consumer: vi.fn(),
            exchange: 'ex',
            name: 'test',
            queue: 'q',
            routingKey: 'rk',
            mqUrl: 'amqps://host:5671/',
        });

        result.stop('shutdown');

        expect(session.stop).toHaveBeenCalledWith('shutdown');
    });

    it('calls connect with { mqUrl, tlsOptions, ...sessionOptions }', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        await createConsumer({
            consumer: vi.fn(),
            exchange: 'ex',
            name: 'test',
            queue: 'q',
            routingKey: 'rk',
            mqUrl: 'amqps://host:5671/',
        });

        expect(connect).toHaveBeenCalledWith({
            mqUrl: 'amqps://host:5671/',
            tlsOptions: undefined,
        });
    });

    it('forwards tlsOptions and sessionOptions to connect', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        const tlsOptions = { key: 'k', cert: 'c' };

        await createConsumer({
            consumer: vi.fn(),
            exchange: 'ex',
            name: 'test',
            queue: 'q',
            routingKey: 'rk',
            mqUrl: 'amqps://host:5671/',
            tlsOptions,
            maxRetries: 10,
        });

        expect(connect).toHaveBeenCalledWith(
            expect.objectContaining({
                mqUrl: 'amqps://host:5671/',
                tlsOptions,
                maxRetries: 10,
            }),
        );
    });

    it('forwards all consume params (consumer, durable, exchange, name, noAck, queue, routingKey, type)', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        const consumer = vi.fn();

        await createConsumer({
            consumer,
            durable: false,
            exchange: 'my-ex',
            name: 'my-name',
            noAck: true,
            queue: 'my-q',
            routingKey: 'my-rk',
            type: 'fanout',
            mqUrl: 'amqps://host:5671/',
        });

        expect(session.exchange).toHaveBeenCalledWith('my-ex', 'fanout', {
            durable: false,
        });
        expect(session.queue).toHaveBeenCalledWith('my-q', { durable: false });
    });

    it('forwards process.env.MQ_URL when mqUrl is omitted', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        vi.stubEnv('MQ_URL', 'amqps://envhost:5671/');

        await createConsumer({
            consumer: vi.fn(),
            exchange: 'ex',
            name: 'test',
            queue: 'q',
            routingKey: 'rk',
        });

        expect(connect).toHaveBeenCalledWith(
            expect.objectContaining({
                mqUrl: undefined,
            }),
        );
    });
});
