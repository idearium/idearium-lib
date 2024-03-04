'use strict';

import { safePromise } from '../index.js';

describe('safePromise', () => {
    it('is a function', () => {
        expect(typeof safePromise).toBe('function');
    });

    it('returns a tuple for successful promises', async () => {
        expect.assertions(1);

        await expect(safePromise(Promise.resolve('test'))).resolves.toEqual([
            null,
            'test',
        ]);
    });

    it('returns a tuple for errors', async () => {
        expect.assertions(1);

        const error = new Error('test');

        await expect(safePromise(Promise.reject(error))).resolves.toEqual([
            error,
        ]);
    });
});
