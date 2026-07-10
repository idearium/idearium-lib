import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@cloudamqp/amqp-client', () => ({
    AMQPSession: {
        connect: vi.fn(),
    },
    builtinParsers: { json: vi.fn() },
}));

vi.mock('@idearium/log', () => ({
    default: () => ({ info: vi.fn(), error: vi.fn(), warn: vi.fn() }),
}));

import { AMQPSession, builtinParsers } from '@cloudamqp/amqp-client';
import { connect } from '../../lib/connect.js';

describe('connect', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();
    });

    describe('connection and options forwarding', () => {
        it('calls AMQPSession.connect with the raw URL string and an options object', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            await connect({ mqUrl: 'amqps://host:5671/vhost' });

            expect(AMQPSession.connect).toHaveBeenCalledTimes(1);
            expect(AMQPSession.connect).toHaveBeenCalledWith(
                'amqps://host:5671/vhost',
                expect.objectContaining({}),
            );
        });

        it('forwards tlsOptions as a nested property', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            const tlsOptions = { key: 'k', cert: 'c', ca: 'ca' };

            await connect({ mqUrl: 'amqps://host:5671/', tlsOptions });

            expect(AMQPSession.connect).toHaveBeenCalledWith(
                'amqps://host:5671/',
                expect.objectContaining({ tlsOptions }),
            );
        });

        it('passes parsers: builtinParsers and defaultContentType: application/json', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            await connect({ mqUrl: 'amqps://host:5671/' });

            expect(AMQPSession.connect).toHaveBeenCalledWith(
                'amqps://host:5671/',
                expect.objectContaining({
                    parsers: builtinParsers,
                    defaultContentType: 'application/json',
                }),
            );
        });

        it('forwards extra sessionOptions via spread', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            await connect({
                mqUrl: 'amqps://host:5671/',
                maxRetries: 5,
                reconnectInterval: 2000,
            });

            expect(AMQPSession.connect).toHaveBeenCalledWith(
                'amqps://host:5671/',
                expect.objectContaining({
                    maxRetries: 5,
                    reconnectInterval: 2000,
                }),
            );
        });

        it('returns the AMQPSession instance from AMQPSession.connect()', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            const result = await connect({ mqUrl: 'amqps://host:5671/' });

            expect(result).toBe(session);
        });
    });

    describe('URL redaction', () => {
        it('redacts credentials from the URL in log output', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            await connect({ mqUrl: 'amqps://user:pass@host:5671/vhost' });

            expect(AMQPSession.connect).toHaveBeenCalledWith(
                'amqps://user:pass@host:5671/vhost',
                expect.objectContaining({}),
            );

            const options = AMQPSession.connect.mock.calls[0][1];
            expect(JSON.stringify(options)).not.toContain('user:pass');
        });

        it('does not crash when URL has no credentials', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            await expect(
                connect({ mqUrl: 'amqps://host:5671/' }),
            ).resolves.toBeDefined();
        });

        it('does not crash when URL has no scheme separator', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            await expect(
                connect({ mqUrl: 'localhost:5671' }),
            ).resolves.toBeDefined();

            expect(AMQPSession.connect).toHaveBeenCalledWith(
                'localhost:5671',
                expect.objectContaining({}),
            );
        });
    });

    describe('validation and env-var default', () => {
        it('throws when mqUrl is not provided and process.env.MQ_URL is unset', async () => {
            vi.stubEnv('MQ_URL', '');

            await expect(connect({})).rejects.toThrow(
                'mqUrl parameter is required',
            );
        });

        it('uses process.env.MQ_URL as default when mqUrl is omitted', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            vi.stubEnv('MQ_URL', 'amqps://envhost:5671/');

            await connect({});

            expect(AMQPSession.connect).toHaveBeenCalledWith(
                'amqps://envhost:5671/',
                expect.any(Object),
            );
        });

        it('uses explicit mqUrl parameter over process.env.MQ_URL', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            vi.stubEnv('MQ_URL', 'amqps://envhost:5671/');

            await connect({ mqUrl: 'amqps://paramhost:5671/' });

            expect(AMQPSession.connect).toHaveBeenCalledWith(
                'amqps://paramhost:5671/',
                expect.any(Object),
            );
        });
    });

    describe('lifecycle hooks', () => {
        it('wires onconnect as a function', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            await connect({ mqUrl: 'amqps://host:5671/' });

            const options = AMQPSession.connect.mock.calls[0][1];
            expect(typeof options.onconnect).toBe('function');
        });

        it('wires ondisconnect as a function', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            await connect({ mqUrl: 'amqps://host:5671/' });

            const options = AMQPSession.connect.mock.calls[0][1];
            expect(typeof options.ondisconnect).toBe('function');
        });

        it('wires onfailed as a function', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            await connect({ mqUrl: 'amqps://host:5671/' });

            const options = AMQPSession.connect.mock.calls[0][1];
            expect(typeof options.onfailed).toBe('function');
        });

        it('does not throw when invoking the lifecycle hooks', async () => {
            const session = { stop: vi.fn() };
            AMQPSession.connect.mockResolvedValue(session);

            await connect({ mqUrl: 'amqps://host:5671/' });

            const options = AMQPSession.connect.mock.calls[0][1];

            expect(() => options.onconnect()).not.toThrow();
            expect(() => options.ondisconnect(new Error('test'))).not.toThrow();
            expect(() => options.onfailed(new Error('test'))).not.toThrow();
        });
    });
});
