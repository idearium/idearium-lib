'use strict';

const Mandrill = require('../lib/email-services/mandrill');
const moment = require('moment');
const mandrillApiKey = '1234';

describe('class Mandrill', () => {

    describe('create an instance', () => {

        test('should fail, if the apiKey parameter is not provided', () => {

            expect(() => {
                return new Mandrill();
            }).toThrow(/apiKey/);

        });

        test('should work, if everything has been provided correctly', () => {

            const email = new Mandrill(mandrillApiKey);

            expect(email).toBeTruthy();
            expect(email instanceof Mandrill).toBe(true);

        });

        describe('static sendAt', () => {

            test('should throw, if not provided anything', () => {

                expect(() => {
                    Mandrill.sendAt();
                }).toThrow(/momentInTime/);

            });

            test('should throw, if not provided a moment instance', () => {

                expect(() => {
                    Mandrill.sendAt({});
                }).toThrow(/momentInTime/);

            });

            test('should return a string if provided a moment instance', () => {

                expect(() => {
                    Mandrill.sendAt(moment());
                }).not.toThrow(/momentInTime/);

            });

            test('should return a valid send_at string', () => {

                const momentInTime = Mandrill.sendAt(moment.utc('20180101', 'YYYYMMDD'));

                expect(momentInTime).toBe('2018-01-01 00:00:00');

            });

        });

        describe('static validateSendAt', () => {

            test('should return false when a string doesn\'t validate', () => {

                expect(Mandrill.validateSendAt('string')).toBe(false);
                expect(Mandrill.validateSendAt('2018-01-01T10:30:00.000Z')).toBe(false);
                expect(Mandrill.validateSendAt('2018-01-01 10:30:00.000')).toBe(false);

            });

            test('should return false not passed a string', () => {

                expect(Mandrill.validateSendAt(1)).toBe(false);
                expect(Mandrill.validateSendAt({})).toBe(false);
                expect(Mandrill.validateSendAt([])).toBe(false);

            });

            test('should return true when passed an accurate string', () => {

                expect(Mandrill.validateSendAt(Mandrill.sendAt(moment.utc('20180101', 'YYYYMMDD')))).toBe(true);
                expect(Mandrill.validateSendAt('2018-01-01 10:30:00')).toBe(true);

            });

        });

    });

});
