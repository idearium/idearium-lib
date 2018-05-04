/* eslint-env node, mocha */
'use strict';

const { expect } = require('chai');
const Email = require('../lib/email');
const emailServices = require('../lib/email-services');
const mandrillApiKey = '1234';
const Mitm = require('mitm');

describe('class Email', function () {

    describe('create an instance', function () {

        it('should fail, if the apiKey parameter is not provided', function () {

            expect(function () {
                return new Email();
            }).to.throw(Error, /apiKey/);

        });

        it('should fail, if the service class is not provided', function () {

            expect(function () {
                return new Email(mandrillApiKey);
            }).to.throw(Error, /service/i);

            expect(function () {
                return new Email(mandrillApiKey, 'Mandrill');
            }).to.throw(Error, /service/i);

        });

        it('should work, if everything has been provided correctly', function () {

            let email = new Email(mandrillApiKey, emailServices.Mandrill);

            expect(email).to.exist;
            expect(email.service).to.exist;
            expect(email.service instanceof emailServices.Mandrill).to.be.true;

        });

        it('should work, when provided an instance of the Mandrill class', function () {

            let email = new Email(mandrillApiKey, emailServices.Mandrill);

            expect(email).to.exist;
            expect(email.service).to.exist;
            expect(email.service instanceof emailServices.Mandrill).to.be.true;

        });

    });

    describe('Mandrill', function () {

        describe('send', function () {

            it('should fail, if "html" and "text" is not provided', function (done) {

                let email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(function (){
                    email.send({}, function () {});
                }).to.throw(Error, '"message.html" and "message.text" is missing, one of these fields is required.');

                return done();

            });

            it('should fail, if "fromEmail" is not provided', function (done) {

                let email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(function (){
                    email.send({ html: '<p>hello</p>'}, function () {});
                }).to.throw(Error, '"message.fromEmail" field is either missing or is empty.');

                return done();

            });

            it('should fail, if "to" is not provided', function (done) {

                let email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(function (){
                    email.send({
                        'html': '<p>hello</p>',
                        'fromEmail': 'from@test.com'
                    }, function () {});
                }).to.throw(Error, '"message.to" field is either missing or is empty.');

                return done();

            });

            it('should fail, if "to" is not of type String or Array', function (done) {

                let email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(function (){
                    email.send({
                        'html': '<p>hello</p>',
                        'fromEmail': 'from@test.com',
                        'to': {}
                    }, function () {});
                }).to.throw(Error, '"message.to" must be of type String or Array.');

                return done();

            });

            it('should fail, if "to" (String) has an invalid email', function (done) {

                let email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(function (){
                    email.send({
                        'html': '<p>hello</p>',
                        'fromEmail': 'from@test.com',
                        'to': 'test@test'
                    }, function () {});
                }).to.throw(Error, 'test@test is not a valid email address.');

                return done();

            });

            it('should fail, if "to" is an empty Array', function (done) {

                let email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(function (){
                    email.send({
                        'html': '<p>hello</p>',
                        'fromEmail': 'from@test.com',
                        'to': []
                    }, function () {});
                }).to.throw(Error, '"message.to" Array field is empty.');

                return done();

            });

            it('should fail, if "to" Array has a missing email field', function (done) {

                let email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(function (){
                    email.send({
                        'html': '<p>hello</p>',
                        'fromEmail': 'from@test.com',
                        'to': [{ name: 'test' }]
                    }, function () {});
                }).to.throw(Error, 'Missing "email" field in one of the "message.to" Array.');

                return done();

            });

            it('should fail, if "to" Array has an invalid email', function (done) {

                let email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(function (){
                    email.send({
                        'html': '<p>hello</p>',
                        'fromEmail': 'from@test.com',
                        'to': [{
                            'name': 'test',
                            'email': 'test@test'
                        }]
                    }, function () {});
                }).to.throw(Error, 'test@test is not a valid email address.');

                return done();

            });

            it('should support the sendAt property', function (done) {

                // eslint-disable-next-line new-cap
                const mitm = Mitm();
                const email = new Email(mandrillApiKey, emailServices.Mandrill);

                email.send({
                    fromEmail: 'from@test.com',
                    html: '<p>hello</p>',
                    sendAt: '2004',
                    subject: 'Subject',
                    to: [
                        {
                            email: 'test@test.com',
                            name: 'test',
                        },
                    ],
                }, function (err) {

                    return done(err);

                });

                mitm.on('request', function (req) {

                    let body = '';

                    /* eslint-disable max-nested-callbacks */
                    req.on('data', data => (body += data));

                    req.on('end', () => {

                        expect(body).to.match(/send_at":"2004/);
                        expect(body).to.not.match(/sendAt/);

                        // Disable this, so it doesn't error other issues.
                        mitm.disable();

                        return done();

                    });
                    /* eslint-enable max-nested-callbacks */

                });

            });

        });

    });


});
