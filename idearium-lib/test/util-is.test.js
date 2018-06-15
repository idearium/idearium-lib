'use strict';

const {
    isArray,
    isBeta,
    isDevelopment,
    isEqual,
    isObject,
    isProduction,
    isStaging,
    isTest,
} = require('../lib/util');

describe('util-is', () => {

    test('is an array', () => {
        expect(isArray([])).toBe(true);
    });

    test('is development environment', () => {
        expect(isDevelopment('DeVeLoPmEnT')).toBe(true);
    });

    test('is beta environment', () => {
        expect(isBeta('BeTa')).toBe(true);
    });

    test('is staging environment', () => {
        expect(isStaging('StAgInG')).toBe(true);
    });

    test('is production environment', () => {
        expect(isProduction('PrOdUcTiOn')).toBe(true);
    });

    test('is test environment', () => {
        expect(isTest('TesT')).toBe(true);
    });

    test('should be equal', () => {
        expect(isEqual('string', 'string')).toBe(true);
    });

    test('should not be equal', () => {
        expect(isEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(false);
    });

    test('should not be equal', () => {
        expect(isEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toBe(false);
    });

    test('should be equal', () => {
        expect(isEqual(0, 0)).toBe(true);
    });

    test('should not be equal', () => {
        expect(isEqual(0, -0)).toBe(false);
    });

    test('should be equal', () => {
        expect(isEqual()).toBe(true);
    });

    test('should be equal', () => {
        expect(isEqual(null, null)).toBe(true);
    });

    test('should be equal', () => {
        expect(isEqual(NaN, NaN)).toBe(true);
    });

    test('should be an object', () => {
        expect(isObject({})).toBe(true);
    });

    test('should not be an object', () => {
        expect(isObject('string')).toBe(false);
    });

    test('should not be an object', () => {
        expect(isObject([])).toBe(false);
    });

    test('should not be an object', () => {
        expect(isObject()).toBe(false);
    });

    test('should not be an object', () => {
        expect(isObject(null)).toBe(false);
    });

});
