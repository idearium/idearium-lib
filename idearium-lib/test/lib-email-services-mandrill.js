/* eslint-env node, mocha */
'use strict';

const { expect } = require('chai');
const MandrillService = require('../lib/email-services/mandrill');
const moment = require('moment');
const mandrillApiKey = '1234';

describe('class MandrillService', function () {

    describe('create an instance', function () {

        it('should fail, if the apiKey parameter is not provided', function () {

            expect(function () {
                return new MandrillService();
            }).to.throw(Error, /apiKey/);

        });

        it('should work, if everything has been provided correctly', function () {

            const email = new MandrillService(mandrillApiKey);

            /* eslint-disable no-unused-expressions */
            expect(email).to.exist;
            expect(email instanceof MandrillService).to.be.true;
            /* eslint-enable no-unused-expressions */

        });

        describe('static sendAt', function () {

            it('should throw, if not provided anything', function () {

                expect(function () {
                    MandrillService.sendAt();
                }).to.throw(Error, /momentInTime/);

            });

            it('should throw, if not provided a moment instance', function () {

                expect(function () {
                    MandrillService.sendAt({});
                }).to.throw(Error, /momentInTime/);

            });

            it('should return a string if provided a moment instance', function () {

                expect(function () {
                    MandrillService.sendAt(moment());
                }).to.not.throw(Error, /momentInTime/);

            });

            it('should return a valid send_at string', function () {

                const momentInTime = MandrillService.sendAt(moment.utc('20180101', 'YYYYMMDD'));

                expect(momentInTime).to.equal('2018-01-01 00:00:00');

            });

        });

        describe('static validateSendAt', function () {

            it('should return false when a string doesn\'t validate', function () {

                expect(MandrillService.validateSendAt('string')).to.equal(false);
                expect(MandrillService.validateSendAt('2018-01-01T10:30:00.000Z')).to.equal(false);
                expect(MandrillService.validateSendAt('2018-01-01 10:30:00.000')).to.equal(false);

            });

            it('should return false not passed a string', function () {

                expect(MandrillService.validateSendAt(1)).to.equal(false);
                expect(MandrillService.validateSendAt({})).to.equal(false);
                expect(MandrillService.validateSendAt([])).to.equal(false);

            });

            it('should return true when passed an accurate string', function () {

                expect(MandrillService.validateSendAt(MandrillService.sendAt(moment.utc('20180101', 'YYYYMMDD')))).to.equal(true);
                expect(MandrillService.validateSendAt('2018-01-01 10:30:00')).to.equal(true);

            });

        });

    });

});
