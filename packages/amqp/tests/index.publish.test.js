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
import { createClient } from '../index.js';

const createMockSession = () => {
    const mockExchange = {
        publish: vi.fn().mockResolvedValue(),
    };
    const session = {
        exchange: vi.fn().mockResolvedValue(mockExchange),
        queue: vi.fn(),
        stop: vi.fn(),
    };

    return { mockExchange, session };
};

describe('createClient publish', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('propagates errors from the underlying exchange', async () => {
        const { mockExchange, session } = createMockSession();
        mockExchange.publish.mockRejectedValue(new Error('exchange boom'));
        connect.mockResolvedValue(session);

        const client = await createClient({ mqUrl: 'amqps://host:5671/' });

        await expect(
            client.publish({
                data: { a: 1 },
                exchange: 'ex',
                routingKey: 'rk',
            }),
        ).rejects.toThrow('exchange boom');
    });

    it('resolves on success', async () => {
        const { session } = createMockSession();
        connect.mockResolvedValue(session);

        const client = await createClient({ mqUrl: 'amqps://host:5671/' });

        await expect(
            client.publish({
                data: { a: 1 },
                exchange: 'ex',
                routingKey: 'rk',
            }),
        ).resolves.toBeUndefined();
    });

    it('passes data object directly to exchange.publish without buffer conversion', async () => {
        const { mockExchange, session } = createMockSession();
        connect.mockResolvedValue(session);

        const client = await createClient({ mqUrl: 'amqps://host:5671/' });

        const data = { key: 'value', nested: { x: 1 } };

        await client.publish({ data, exchange: 'ex', routingKey: 'rk' });

        const publishedData = mockExchange.publish.mock.calls[0][0];
        expect(publishedData).toBe(data);
    });
});
