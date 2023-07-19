const { safeBatchProcess, safeMessageProcess } = require('..');

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
});

afterEach(() => {
    /* eslint-disable no-console */
    console.error.mockRestore();
    console.log.mockRestore();
    /* eslint-enable no-console */
});

describe('safeBatchProcess', () => {
    it('is a function', () => {
        expect(typeof safeBatchProcess).toBe('function');
    });

    it('returns a promise', () => {
        expect.assertions(1);

        const batch = {
            ackAll: jest.fn(),
            retryAll: jest.fn(),
            messages: [],
        };
        const process = jest.fn(async () => Promise.resolve());
        const result = safeBatchProcess({ batch, process });

        expect(result).toBeInstanceOf(Promise);
    });

    it('will call ackAll when successful', async () => {
        expect.assertions(4);

        const batch = {
            ackAll: jest.fn(),
            retryAll: jest.fn(),
            messages: [],
        };
        const process = jest.fn(async () => Promise.resolve());
        await safeBatchProcess({ batch, process });

        expect(batch.ackAll).toHaveBeenCalled();
        expect(batch.retryAll).not.toHaveBeenCalled();
        /* eslint-disable no-console */
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(/Processed/)
        );
        expect(console.error).not.toHaveBeenCalled();
        /* eslint-enable no-console */
    });

    it('will call retryAll when successful', async () => {
        expect.assertions(4);

        const batch = {
            ackAll: jest.fn(),
            retryAll: jest.fn(),
            messages: [],
        };
        const process = jest.fn(async () => {
            throw new Error('Rejecting');
        });
        await safeBatchProcess({ batch, process });

        expect(batch.ackAll).not.toHaveBeenCalled();
        expect(batch.retryAll).toHaveBeenCalled();
        /* eslint-disable no-console */
        expect(console.log).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
        /* eslint-enable no-console */
    });
});

describe('safeMessageProcess', () => {
    it('is a function', () => {
        expect(typeof safeMessageProcess).toBe('function');
    });

    it('returns a promise', () => {
        expect.assertions(1);

        const message = {
            id: '1234',
            ack: jest.fn(),
            fail: jest.fn(),
        };
        const process = jest.fn(async () => Promise.resolve());
        const result = safeMessageProcess({ message, process });

        expect(result).toBeInstanceOf(Promise);
    });

    it('will call ack when successful', async () => {
        expect.assertions(4);

        const message = {
            id: 'ABCD',
            ack: jest.fn(),
            fail: jest.fn(),
        };
        const process = jest.fn(async () => Promise.resolve());
        await safeMessageProcess({ message, process });

        expect(message.ack).toHaveBeenCalled();
        expect(message.fail).not.toHaveBeenCalled();
        /* eslint-disable no-console */
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(/Processed/)
        );
        expect(console.error).not.toHaveBeenCalled();
        /* eslint-enable no-console */
    });

    it('will call fail when unsuccessful', async () => {
        expect.assertions(4);

        const message = {
            id: 'XYZ',
            ack: jest.fn(),
            fail: jest.fn(),
        };
        const process = jest.fn(async () => {
            throw new Error('Rejecting');
        });
        await safeMessageProcess({ message, process });

        expect(message.ack).not.toHaveBeenCalled();
        expect(message.fail).toHaveBeenCalled();
        /* eslint-disable no-console */
        expect(console.log).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
        /* eslint-enable no-console */
    });
});
