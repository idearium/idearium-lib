'use strict';

const { withResult } = require('../');

describe('withResult', () => {
    it('is a function', () => {
        expect(typeof withResult).toBe('function');
    });

    it('returns a tuple for successful promises', async () => {
        expect.assertions(1);

        await expect(withResult(Promise.resolve('test'))).resolves.toEqual([
            null,
            'test'
        ]);
    });

    it('returns a tuple for errors', async () => {
        expect.assertions(1);

        const error = new Error('test');

        await expect(withResult(Promise.reject(error))).resolves.toEqual([
            error,
            null
        ]);
    });
});
