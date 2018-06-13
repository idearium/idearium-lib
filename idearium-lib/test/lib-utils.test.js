'use strict';

const utils = require('../lib/utils');

describe('utils', () => {

    describe('parseConfigAsBoolean()', () => {

        it('should error if default value is not provided', () => {

            expect(() => {
                utils.parseConfigAsBoolean();
            }).toThrow();

        });

        it('should return default value if provided value is undefined', () => {

            const result1 = utils.parseConfigAsBoolean(undefined, true);
            const result2 = utils.parseConfigAsBoolean(undefined, false);

            expect(result1).toBe(true);
            expect(result2).toBe(false);

        });

        it('should return true if provided value is a String of "true"', () => {

            const result1 = utils.parseConfigAsBoolean('true', true);

            expect(result1).toBe(true);

        });


        it('should return true if provided value is a String of "false"', () => {

            const result1 = utils.parseConfigAsBoolean('false', true);

            expect(result1).toBe(false);

        });

    });

});
