'use strict';

const safePromiseAll = require('..');

describe('safePromiseAll', () => {
    it('is a function', () => {
        expect(typeof safePromiseAll).toBe('function');
    });

    it('returns a tuple for successful promises', async () => {
        expect.assertions(2);

        await expect(
            safePromiseAll([Promise.resolve('test')])
        ).resolves.toEqual([null, ['test']]);

        await expect(
            safePromiseAll([Promise.resolve('test1'), Promise.resolve('test2')])
        ).resolves.toEqual([null, ['test1', 'test2']]);
    });

    it('returns a tuple for errors', async () => {
        expect.assertions(2);

        const error1 = new Error('test1');
        const error2 = new Error('test2');

        await expect(safePromiseAll([Promise.reject(error1)])).resolves.toEqual(
            [[error1]]
        );

        await expect(
            safePromiseAll([Promise.reject(error1), Promise.reject(error2)])
        ).resolves.toEqual([[error1, error2]]);
    });
});
