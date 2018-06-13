'use strict';

const { find } = require('../lib/util');

describe('util-find', () => {

    it('will find value 1', () => {
        expect(find([1], element => element === 1)).toBe(1);
    });

    it('will find value 2', () => {
        expect(find({ a: { b: [2] } }, element => element === 2)).toBe(2);
    });

});
