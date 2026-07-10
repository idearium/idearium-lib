import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../lib/connect.js', () => ({
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

import { connect } from '../../lib/connect.js';
import { createConsumer } from '../../lib/consumer.js';

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
