'use strict';

const promiseAllSettled = require('..');

describe('promiseAllSettled', () => {
    it('is a function', () => {
        expect(typeof promiseAllSettled).toBe('function');
    });

    it('returns a tuple for successful promises', async () => {
        expect.assertions(2);

        await expect(
            promiseAllSettled([Promise.resolve('test')])
        ).resolves.toEqual([[], ['test']]);

        await expect(
            promiseAllSettled([
                Promise.resolve('test1'),
                Promise.resolve('test2'),
            ])
        ).resolves.toEqual([[], ['test1', 'test2']]);
    });

    it('returns a tuple for errors', async () => {
        expect.assertions(2);

        const error1 = new Error('test1');
        const error2 = new Error('test2');

        await expect(
            promiseAllSettled([Promise.reject(error1)])
        ).resolves.toEqual([[error1], []]);

        await expect(
            promiseAllSettled([Promise.reject(error1), Promise.reject(error2)])
        ).resolves.toEqual([[error1, error2], []]);
    });

    it('returns both errors and results', async () => {
        expect.assertions(1);

        const error1 = new Error('test1');
        const error2 = new Error('test2');

        await expect(
            promiseAllSettled([
                Promise.reject(error1),
                Promise.resolve('test1'),
                Promise.reject(error2),
                Promise.resolve('test2'),
            ])
        ).resolves.toEqual([
            [error1, error2],
            ['test1', 'test2'],
        ]);
    });
});
