'use strict';

const {
    toCallback,
    toDecimals,
    toFlatArray,
    toLowercaseKeys,
    toPromise,
} = require('../lib/util');

describe('util-to', () => {

    test('converts to a promise', async () => {

        expect.assertions(1);

        const callbackFunction = (data, callback) => callback(null, data);
        const promiseFunction = toPromise(callbackFunction);
        const result = await promiseFunction('promised!');

        expect(result).toBe('promised!');

    });

    test('converts to a callback', (done) => {

        const promiseFunction = data => Promise.resolve(data);
        const callbackFunction = toCallback(promiseFunction);

        callbackFunction('callback', (err, result) => {

            if (err) {
                return done(err);
            }

            expect(result).toBe('callback');

            return done();

        });

    });

    test('converts all keys to lowercase', () => {

        expect(JSON.stringify(toLowercaseKeys({ A: { B: [{ C: [{ D: 1 }] }] } })))
            .toBe(JSON.stringify({ a: { b: [{ c: [{ d: 1 }] }] } }));

    });

    test('reduces all values into an array', () => {

        expect(JSON.stringify(toFlatArray({ a: [{ b: 1 }, { c: 2 }, { d: [3, 4] }] })))
            .toEqual(JSON.stringify([1, 2, 3, 4]));

    });

    test('rounds a floating point number', () => {
        expect(toDecimals(10.0)).toBe(10);
    });

    test('rounds a floating point number', () => {
        expect(toDecimals(10.1)).toBe(10);
    });

    test('rounds a floating point number', () => {
        expect(toDecimals(10.2)).toBe(10);
    });

    test('rounds a floating point number', () => {
        expect(toDecimals(10.3)).toBe(10);
    });

    test('rounds a floating point number', () => {
        expect(toDecimals(10.4)).toBe(10);
    });

    test('rounds a floating point number', () => {
        expect(toDecimals(10.5)).toBe(11);
    });

    test('rounds a floating point number', () => {
        expect(toDecimals(10.6)).toBe(11);
    });

    test('rounds a floating point number', () => {
        expect(toDecimals(10.7)).toBe(11);
    });

    test('rounds a floating point number', () => {
        expect(toDecimals(10.8)).toBe(11);
    });

    test('rounds a floating point number', () => {
        expect(toDecimals(10.9)).toBe(11);
    });

    test('rounds a floating point number', () => {
        expect(toDecimals(1 / 3, 2)).toBe(0.33);
    });

});
