import { beforeEach, describe, expect, it, vi } from 'vitest';

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

import { consumeFactory } from '../../lib/consume.js';

const createMockSession = ({ exchangeResult = {}, queueResult } = {}) => {
    let capturedCallback;

    const subscription = { cancel: vi.fn(), consumerTag: 'tag-1' };

    const q = {
        bind: vi.fn().mockResolvedValue(),
        subscribe: vi.fn().mockImplementation((params, cb) => {
            capturedCallback = cb;
            return Promise.resolve(subscription);
        }),
        ...queueResult,
    };

    const session = {
        exchange: vi.fn().mockResolvedValue(exchangeResult),
        queue: vi.fn().mockResolvedValue(q),
    };

    return {
        capturedCallback: () => capturedCallback,
        q,
        session,
        subscription,
    };
};

describe('consumeFactory', () => {
    describe('setup verification', () => {
        it('calls session.exchange with exchange name, type, and { durable }', async () => {
            const { session } = createMockSession();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer: vi.fn(),
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            expect(session.exchange).toHaveBeenCalledWith('ex', 'topic', {
                durable: true,
            });
        });

        it('calls session.queue with queue name and { durable }', async () => {
            const { session } = createMockSession();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer: vi.fn(),
                exchange: 'ex',
                name: 'test',
                queue: 'my-queue',
                routingKey: 'rk',
            });

            expect(session.queue).toHaveBeenCalledWith('my-queue', {
                durable: true,
            });
        });

        it('calls q.bind with exchange name and routing key', async () => {
            const { q, session } = createMockSession();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer: vi.fn(),
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            expect(q.bind).toHaveBeenCalledWith('ex', 'rk');
        });

        it('calls q.subscribe with { noAck } params and a callback function', async () => {
            const { q, session } = createMockSession();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer: vi.fn(),
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            expect(q.subscribe).toHaveBeenCalledWith(
                { noAck: false },
                expect.any(Function),
            );
        });

        it('returns { name, subscription } with correct name value', async () => {
            const { session, subscription } = createMockSession();

            const { consume } = consumeFactory({ session });

            const result = await consume({
                consumer: vi.fn(),
                exchange: 'ex',
                name: 'my-consumer',
                queue: 'q',
                routingKey: 'rk',
            });

            expect(result).toEqual({
                name: 'my-consumer',
                subscription,
            });
        });

        it('returns the subscription object from q.subscribe (identity check)', async () => {
            const { session, subscription } = createMockSession();

            const { consume } = consumeFactory({ session });

            const result = await consume({
                consumer: vi.fn(),
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            expect(result.subscription).toBe(subscription);
        });
    });

    describe('defaults and overrides', () => {
        it('defaults durable to true for both session.exchange and session.queue', async () => {
            const { session } = createMockSession();

            const { consume } = consumeFactory({ session });

            await consume({
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
        });

        it('forwards durable: false to both session.exchange and session.queue', async () => {
            const { session } = createMockSession();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer: vi.fn(),
                durable: false,
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            expect(session.exchange).toHaveBeenCalledWith('ex', 'topic', {
                durable: false,
            });
            expect(session.queue).toHaveBeenCalledWith('q', {
                durable: false,
            });
        });

        it('defaults type to topic', async () => {
            const { session } = createMockSession();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer: vi.fn(),
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            expect(session.exchange).toHaveBeenCalledWith(
                'ex',
                'topic',
                expect.any(Object),
            );
        });

        it('forwards type: direct override', async () => {
            const { session } = createMockSession();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer: vi.fn(),
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
                type: 'direct',
            });

            expect(session.exchange).toHaveBeenCalledWith(
                'ex',
                'direct',
                expect.any(Object),
            );
        });

        it('defaults noAck to false in q.subscribe params', async () => {
            const { q, session } = createMockSession();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer: vi.fn(),
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            expect(q.subscribe).toHaveBeenCalledWith(
                { noAck: false },
                expect.any(Function),
            );
        });

        it('forwards noAck: true to q.subscribe params', async () => {
            const { q, session } = createMockSession();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer: vi.fn(),
                exchange: 'ex',
                name: 'test',
                noAck: true,
                queue: 'q',
                routingKey: 'rk',
            });

            expect(q.subscribe).toHaveBeenCalledWith(
                { noAck: true },
                expect.any(Function),
            );
        });
    });

    describe('callback - codec path (msg.body is a deserialized object)', () => {
        it('wraps a single object in an array for the consumer', async () => {
            const { capturedCallback, session } = createMockSession();
            const consumer = vi.fn();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer,
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            await capturedCallback()({ body: { key: 'value' } });

            expect(consumer).toHaveBeenCalledWith([{ key: 'value' }]);
        });

        it('passes an array through without double-wrapping', async () => {
            const { capturedCallback, session } = createMockSession();
            const consumer = vi.fn();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer,
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            const arr = [{ a: 1 }, { a: 2 }];

            await capturedCallback()({ body: arr });

            expect(consumer).toHaveBeenCalledWith(arr);
        });
    });

    describe('callback - legacy fallback (msg.body is Uint8Array)', () => {
        it('parses Uint8Array as JSON and wraps in array', async () => {
            const { capturedCallback, session } = createMockSession();
            const consumer = vi.fn();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer,
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            const body = new Uint8Array(
                Buffer.from(JSON.stringify({ key: 'value' })),
            );

            await capturedCallback()({ body });

            expect(consumer).toHaveBeenCalledWith([{ key: 'value' }]);
        });
    });

    describe('callback - array wrapping', () => {
        it('wraps a single object as a single-element array', async () => {
            const { capturedCallback, session } = createMockSession();
            const consumer = vi.fn();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer,
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            await capturedCallback()({ body: { x: 1 } });

            expect(consumer).toHaveBeenCalledWith([{ x: 1 }]);
        });

        it('passes an array through unchanged', async () => {
            const { capturedCallback, session } = createMockSession();
            const consumer = vi.fn();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer,
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            await capturedCallback()({ body: [{ a: 1 }] });

            expect(consumer).toHaveBeenCalledWith([{ a: 1 }]);
        });

        it('wraps null body as [null]', async () => {
            const { capturedCallback, session } = createMockSession();
            const consumer = vi.fn();

            const { consume } = consumeFactory({ session });

            await consume({
                consumer,
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            await capturedCallback()({ body: null });

            expect(consumer).toHaveBeenCalledWith([null]);
        });
    });

    describe('callback - error handling', () => {
        it('catches a sync throw, logs via log.error, then re-throws the same error', async () => {
            const { capturedCallback, session } = createMockSession();
            const consumerError = new Error('consumer boom');
            const consumer = vi.fn().mockImplementation(() => {
                throw consumerError;
            });

            const { consume } = consumeFactory({ session });

            await consume({
                consumer,
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            await expect(capturedCallback()({ body: { a: 1 } })).rejects.toBe(
                consumerError,
            );
        });

        it('catches an async rejection, logs via log.error, then re-throws the same error', async () => {
            const { capturedCallback, session } = createMockSession();
            const consumerError = new Error('async consumer boom');
            const consumer = vi.fn().mockRejectedValue(consumerError);

            const { consume } = consumeFactory({ session });

            await consume({
                consumer,
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            await expect(capturedCallback()({ body: { a: 1 } })).rejects.toBe(
                consumerError,
            );
        });

        it('re-throws the SAME error instance (identity check)', async () => {
            const { capturedCallback, session } = createMockSession();
            const consumerError = new Error('identity check');
            const consumer = vi.fn().mockRejectedValue(consumerError);

            const { consume } = consumeFactory({ session });

            await consume({
                consumer,
                exchange: 'ex',
                name: 'test',
                queue: 'q',
                routingKey: 'rk',
            });

            try {
                await capturedCallback()({ body: { a: 1 } });
            } catch (err) {
                expect(err).toBe(consumerError);
            }
        });

        it('re-throws even with noAck: true (caught and logged by the consume callback)', async () => {
            const { capturedCallback, session } = createMockSession();
            const consumerError = new Error('noAck boom');
            const consumer = vi.fn().mockRejectedValue(consumerError);

            const { consume } = consumeFactory({ session });

            await consume({
                consumer,
                exchange: 'ex',
                name: 'test',
                noAck: true,
                queue: 'q',
                routingKey: 'rk',
            });

            await expect(capturedCallback()({ body: { a: 1 } })).rejects.toBe(
                consumerError,
            );
        });
    });

    describe('validation', () => {
        it('throws when name is missing', async () => {
            const { session } = createMockSession();
            const { consume } = consumeFactory({ session });

            await expect(
                consume({
                    consumer: vi.fn(),
                    exchange: 'ex',
                    queue: 'q',
                    routingKey: 'rk',
                }),
            ).rejects.toThrow('The name parameter must be provided');
        });

        it('throws when consumer is missing', async () => {
            const { session } = createMockSession();
            const { consume } = consumeFactory({ session });

            await expect(
                consume({
                    exchange: 'ex',
                    name: 'test',
                    queue: 'q',
                    routingKey: 'rk',
                }),
            ).rejects.toThrow('The consumer parameter must be provided');
        });

        it('throws when exchange is missing', async () => {
            const { session } = createMockSession();
            const { consume } = consumeFactory({ session });

            await expect(
                consume({
                    consumer: vi.fn(),
                    name: 'test',
                    queue: 'q',
                    routingKey: 'rk',
                }),
            ).rejects.toThrow('The exchange parameter must be provided');
        });

        it('throws when queue is missing', async () => {
            const { session } = createMockSession();
            const { consume } = consumeFactory({ session });

            await expect(
                consume({
                    consumer: vi.fn(),
                    exchange: 'ex',
                    name: 'test',
                    routingKey: 'rk',
                }),
            ).rejects.toThrow('The queue parameter must be provided');
        });

        it('throws when routingKey is undefined', async () => {
            const { session } = createMockSession();
            const { consume } = consumeFactory({ session });

            await expect(
                consume({
                    consumer: vi.fn(),
                    exchange: 'ex',
                    name: 'test',
                    queue: 'q',
                }),
            ).rejects.toThrow('The routingKey parameter must be provided');
        });

        it('does not throw when routingKey is empty string (valid for fanout)', async () => {
            const { session } = createMockSession();
            const { consume } = consumeFactory({ session });

            await expect(
                consume({
                    consumer: vi.fn(),
                    exchange: 'ex',
                    name: 'test',
                    queue: 'q',
                    routingKey: '',
                    type: 'fanout',
                }),
            ).resolves.toBeDefined();
        });
    });
});
