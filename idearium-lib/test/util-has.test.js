'use strict';

const { hasProperty, hasValue } = require('../lib/util');

describe('util-has', () => {

    it('has property a', () => {
        expect(hasProperty({ a: 1 }, 'a')).toBe(true);
    });

    it('does not have property b', () => {
        expect(hasProperty({ a: 1 }, 'b')).toBe(false);
    });

    it('has value 1', () => {
        expect(hasValue({ a: 1 }, 1)).toBe(true);
    });

    it('does not have value 2', () => {
        expect(hasValue({ a: 1 }, 2)).toBe(false);
    });

});
