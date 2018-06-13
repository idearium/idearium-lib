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

    it('is an array', () => {
        expect(isArray([])).toBe(true);
    });

    it('is development environment', () => {
        expect(isDevelopment('DeVeLoPmEnT')).toBe(true);
    });

    it('is beta environment', () => {
        expect(isBeta('BeTa')).toBe(true);
    });

    it('is staging environment', () => {
        expect(isStaging('StAgInG')).toBe(true);
    });

    it('is production environment', () => {
        expect(isProduction('PrOdUcTiOn')).toBe(true);
    });

    it('is test environment', () => {
        expect(isTest('TesT')).toBe(true);
    });

    it('should be equal', () => {
        expect(isEqual('string', 'string')).toBe(true);
    });

    it('should not be equal', () => {
        expect(isEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(false);
    });

    it('should not be equal', () => {
        expect(isEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toBe(false);
    });

    it('should be equal', () => {
        expect(isEqual(0, 0)).toBe(true);
    });

    it('should not be equal', () => {
        expect(isEqual(0, -0)).toBe(false);
    });

    it('should be equal', () => {
        expect(isEqual()).toBe(true);
    });

    it('should be equal', () => {
        expect(isEqual(null, null)).toBe(true);
    });

    it('should be equal', () => {
        expect(isEqual(NaN, NaN)).toBe(true);
    });

    it('should be an object', () => {
        expect(isObject({})).toBe(true);
    });

    it('should not be an object', () => {
        expect(isObject('string')).toBe(false);
    });

    it('should not be an object', () => {
        expect(isObject([])).toBe(false);
    });

    it('should not be an object', () => {
        expect(isObject()).toBe(false);
    });

    it('should not be an object', () => {
        expect(isObject(null)).toBe(false);
    });

});
