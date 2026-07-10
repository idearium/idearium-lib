import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@idearium/log/multi', () => ({
    default: () => vi.fn(),
}));

import { publishFactory } from '../../lib/publish.js';

describe('publishFactory', () => {
    let mockExchange;
    let mockSession;

    beforeEach(() => {
        vi.clearAllMocks();

        mockExchange = {
            publish: vi.fn().mockResolvedValue(),
        };
        mockSession = {
            exchange: vi.fn().mockResolvedValue(mockExchange),
        };
    });

    describe('core behaviour', () => {
        it('calls session.exchange with exchange name, type, and { durable }', async () => {
            const { publish } = publishFactory({ session: mockSession });

            await publish({
                data: { a: 1 },
                exchange: 'ex',
                routingKey: 'rk',
            });

            expect(mockSession.exchange).toHaveBeenCalledWith('ex', 'topic', {
                durable: true,
            });
        });

        it('passes the raw data object to exchange.publish (first arg)', async () => {
            const { publish } = publishFactory({ session: mockSession });

            const data = { key: 'value' };

            await publish({ data, exchange: 'ex', routingKey: 'rk' });

            expect(mockExchange.publish).toHaveBeenCalledWith(
                data,
                expect.objectContaining({ routingKey: 'rk' }),
            );
        });

        it('passes { routingKey } as the second arg to exchange.publish', async () => {
            const { publish } = publishFactory({ session: mockSession });

            await publish({
                data: { a: 1 },
                exchange: 'ex',
                routingKey: 'my-key',
            });

            expect(mockExchange.publish).toHaveBeenCalledWith(
                { a: 1 },
                { routingKey: 'my-key' },
            );
        });

        it('does not perform manual Buffer.from / JSON.stringify conversion (object identity preserved)', async () => {
            const { publish } = publishFactory({ session: mockSession });

            const data = { nested: { value: 42 } };

            await publish({ data, exchange: 'ex', routingKey: 'rk' });

            const publishedData = mockExchange.publish.mock.calls[0][0];
            expect(publishedData).toBe(data);
        });
    });

    describe('defaults and overrides', () => {
        it('defaults durable to true', async () => {
            const { publish } = publishFactory({ session: mockSession });

            await publish({
                data: { a: 1 },
                exchange: 'ex',
                routingKey: 'rk',
            });

            expect(mockSession.exchange).toHaveBeenCalledWith('ex', 'topic', {
                durable: true,
            });
        });

        it('forwards durable: false override', async () => {
            const { publish } = publishFactory({ session: mockSession });

            await publish({
                data: { a: 1 },
                durable: false,
                exchange: 'ex',
                routingKey: 'rk',
            });

            expect(mockSession.exchange).toHaveBeenCalledWith('ex', 'topic', {
                durable: false,
            });
        });

        it('defaults type to topic', async () => {
            const { publish } = publishFactory({ session: mockSession });

            await publish({
                data: { a: 1 },
                exchange: 'ex',
                routingKey: 'rk',
            });

            expect(mockSession.exchange).toHaveBeenCalledWith(
                'ex',
                'topic',
                expect.any(Object),
            );
        });

        it('forwards type: fanout override', async () => {
            const { publish } = publishFactory({ session: mockSession });

            await publish({
                data: { a: 1 },
                exchange: 'ex',
                routingKey: 'rk',
                type: 'fanout',
            });

            expect(mockSession.exchange).toHaveBeenCalledWith(
                'ex',
                'fanout',
                expect.any(Object),
            );
        });

        it('forwards routingKey to exchange.publish options', async () => {
            const { publish } = publishFactory({ session: mockSession });

            await publish({
                data: { a: 1 },
                exchange: 'ex',
                routingKey: 'custom-routing-key',
            });

            expect(mockExchange.publish).toHaveBeenCalledWith(
                { a: 1 },
                { routingKey: 'custom-routing-key' },
            );
        });
    });

    describe('validation', () => {
        it('throws when exchange is not provided', async () => {
            const { publish } = publishFactory({ session: mockSession });

            await expect(
                publish({ data: { a: 1 }, routingKey: 'rk' }),
            ).rejects.toThrow('The exchange parameter must be provided');
        });

        it('throws when data is undefined', async () => {
            const { publish } = publishFactory({ session: mockSession });

            await expect(
                publish({ exchange: 'ex', routingKey: 'rk' }),
            ).rejects.toThrow('The data parameter must be provided');
        });

        it('does not throw when data is null', async () => {
            const { publish } = publishFactory({ session: mockSession });

            await expect(
                publish({ data: null, exchange: 'ex', routingKey: 'rk' }),
            ).resolves.toBeUndefined();
        });

        it('does not throw when data is 0', async () => {
            const { publish } = publishFactory({ session: mockSession });

            await expect(
                publish({ data: 0, exchange: 'ex', routingKey: 'rk' }),
            ).resolves.toBeUndefined();
        });

        it('does not throw when data is false', async () => {
            const { publish } = publishFactory({ session: mockSession });

            await expect(
                publish({ data: false, exchange: 'ex', routingKey: 'rk' }),
            ).resolves.toBeUndefined();
        });
    });

    describe('error propagation', () => {
        it('propagates error from session.exchange()', async () => {
            mockSession.exchange.mockRejectedValue(new Error('exchange boom'));

            const { publish } = publishFactory({ session: mockSession });

            await expect(
                publish({ data: { a: 1 }, exchange: 'ex', routingKey: 'rk' }),
            ).rejects.toThrow('exchange boom');
        });

        it('propagates error from exchange.publish()', async () => {
            mockExchange.publish.mockRejectedValue(new Error('publish boom'));

            const { publish } = publishFactory({ session: mockSession });

            await expect(
                publish({ data: { a: 1 }, exchange: 'ex', routingKey: 'rk' }),
            ).rejects.toThrow('publish boom');
        });
    });
});
