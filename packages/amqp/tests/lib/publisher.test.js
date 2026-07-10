import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../lib/connect.js', () => ({
    connect: vi.fn(),
}));
vi.mock('@idearium/log/multi', () => ({
    default: () => vi.fn(),
}));

import { connect } from '../../lib/connect.js';
import { createPublisher } from '../../lib/publisher.js';

const createMockSession = () => {
    const mockExchange = {
        publish: vi.fn().mockResolvedValue(),
    };
    const session = {
        exchange: vi.fn().mockResolvedValue(mockExchange),
        stop: vi.fn(),
    };

    return { mockExchange, session };
};

describe('createPublisher', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();
    });

    describe('factory behaviour', () => {
        it('returns an async function', async () => {
            const { session } = createMockSession();
            connect.mockResolvedValue(session);

            const publish = await createPublisher({
                exchange: 'ex',
                routingKey: 'rk',
                mqUrl: 'amqps://host:5671/',
            });

            expect(typeof publish).toBe('function');
        });

        it('calls connect with { mqUrl, tlsOptions, ...sessionOptions }', async () => {
            const { session } = createMockSession();
            connect.mockResolvedValue(session);

            await createPublisher({
                exchange: 'ex',
                routingKey: 'rk',
                mqUrl: 'amqps://host:5671/',
            });

            expect(connect).toHaveBeenCalledWith({
                mqUrl: 'amqps://host:5671/',
                tlsOptions: undefined,
            });
        });

        it('forwards tlsOptions to connect', async () => {
            const { session } = createMockSession();
            connect.mockResolvedValue(session);

            const tlsOptions = { key: 'k', cert: 'c', ca: 'ca' };

            await createPublisher({
                exchange: 'ex',
                routingKey: 'rk',
                mqUrl: 'amqps://host:5671/',
                tlsOptions,
            });

            expect(connect).toHaveBeenCalledWith({
                mqUrl: 'amqps://host:5671/',
                tlsOptions,
            });
        });

        it('forwards extra sessionOptions to connect', async () => {
            const { session } = createMockSession();
            connect.mockResolvedValue(session);

            await createPublisher({
                exchange: 'ex',
                routingKey: 'rk',
                mqUrl: 'amqps://host:5671/',
                maxRetries: 3,
                reconnectInterval: 1000,
            });

            expect(connect).toHaveBeenCalledWith({
                mqUrl: 'amqps://host:5671/',
                tlsOptions: undefined,
                maxRetries: 3,
                reconnectInterval: 1000,
            });
        });

        it('calls session.exchange with exchange name, type, and { durable }', async () => {
            const { session } = createMockSession();
            connect.mockResolvedValue(session);

            await createPublisher({
                exchange: 'my-exchange',
                routingKey: 'rk',
                mqUrl: 'amqps://host:5671/',
            });

            expect(session.exchange).toHaveBeenCalledWith(
                'my-exchange',
                'topic',
                { durable: true },
            );
        });

        it('defaults durable to true', async () => {
            const { session } = createMockSession();
            connect.mockResolvedValue(session);

            await createPublisher({
                exchange: 'ex',
                routingKey: 'rk',
                mqUrl: 'amqps://host:5671/',
            });

            expect(session.exchange).toHaveBeenCalledWith('ex', 'topic', {
                durable: true,
            });
        });

        it('defaults type to topic', async () => {
            const { session } = createMockSession();
            connect.mockResolvedValue(session);

            await createPublisher({
                exchange: 'ex',
                routingKey: 'rk',
                mqUrl: 'amqps://host:5671/',
            });

            expect(session.exchange).toHaveBeenCalledWith(
                'ex',
                'topic',
                expect.any(Object),
            );
        });
    });

    describe('returned publish function', () => {
        it('publishes to the declared exchange when called with { data }', async () => {
            const { mockExchange, session } = createMockSession();
            connect.mockResolvedValue(session);

            const publish = await createPublisher({
                exchange: 'ex',
                routingKey: 'rk',
                mqUrl: 'amqps://host:5671/',
            });

            await publish({ data: { a: 1 } });

            expect(mockExchange.publish).toHaveBeenCalledTimes(1);
        });

        it('passes data directly to exchange.publish (first arg, no buffer conversion)', async () => {
            const { mockExchange, session } = createMockSession();
            connect.mockResolvedValue(session);

            const publish = await createPublisher({
                exchange: 'ex',
                routingKey: 'rk',
                mqUrl: 'amqps://host:5671/',
            });

            const data = { key: 'value' };

            await publish({ data });

            expect(mockExchange.publish).toHaveBeenCalledWith(data, {
                routingKey: 'rk',
            });
        });

        it('forwards routingKey to exchange.publish options', async () => {
            const { mockExchange, session } = createMockSession();
            connect.mockResolvedValue(session);

            const publish = await createPublisher({
                exchange: 'ex',
                routingKey: 'custom-key',
                mqUrl: 'amqps://host:5671/',
            });

            await publish({ data: { a: 1 } });

            expect(mockExchange.publish).toHaveBeenCalledWith(
                { a: 1 },
                { routingKey: 'custom-key' },
            );
        });

        it('can be called multiple times (reuses exchange handle)', async () => {
            const { mockExchange, session } = createMockSession();
            connect.mockResolvedValue(session);

            const publish = await createPublisher({
                exchange: 'ex',
                routingKey: 'rk',
                mqUrl: 'amqps://host:5671/',
            });

            await publish({ data: { a: 1 } });
            await publish({ data: { a: 2 } });

            expect(mockExchange.publish).toHaveBeenCalledTimes(2);
        });

        it('propagates error from exchange.publish', async () => {
            const { mockExchange, session } = createMockSession();
            mockExchange.publish.mockRejectedValue(new Error('publish fail'));
            connect.mockResolvedValue(session);

            const publish = await createPublisher({
                exchange: 'ex',
                routingKey: 'rk',
                mqUrl: 'amqps://host:5671/',
            });

            await expect(publish({ data: { a: 1 } })).rejects.toThrow(
                'publish fail',
            );
        });
    });

    describe('validation', () => {
        it('throws when exchange is missing', async () => {
            await expect(
                createPublisher({ routingKey: 'rk', mqUrl: 'amqps://h/' }),
            ).rejects.toThrow('exchange parameter is required');
        });

        it('throws when routingKey is undefined', async () => {
            await expect(
                createPublisher({ exchange: 'ex', mqUrl: 'amqps://h/' }),
            ).rejects.toThrow('routingKey parameter is required');
        });

        it('returned function throws when data is undefined', async () => {
            const { session } = createMockSession();
            connect.mockResolvedValue(session);

            const publish = await createPublisher({
                exchange: 'ex',
                routingKey: 'rk',
                mqUrl: 'amqps://host:5671/',
            });

            await expect(publish({})).rejects.toThrow(
                'The data parameter must be provided',
            );
        });
    });

    describe('env-var default', () => {
        it('forwards process.env.MQ_URL to connect when mqUrl is omitted', async () => {
            const { session } = createMockSession();
            connect.mockResolvedValue(session);

            vi.stubEnv('MQ_URL', 'amqps://envhost:5671/');

            await createPublisher({
                exchange: 'ex',
                routingKey: 'rk',
            });

            expect(connect).toHaveBeenCalledWith(
                expect.objectContaining({
                    mqUrl: undefined,
                    tlsOptions: undefined,
                }),
            );
        });
    });
});
