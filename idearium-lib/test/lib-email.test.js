/* eslint-env node, mocha */
'use strict';

const Email = require('../lib/email');
const emailServices = require('../lib/email-services');
const mandrillApiKey = '1234';
const Mitm = require('mitm');

describe('class Email', () => {

    describe('create an instance', () => {

        test('should fail, if the apiKey parameter is not provided', () => {

            expect(() => {
                return new Email();
            }).toThrow(/apiKey/);

        });

        test('should fail, if the service class is not provided', () => {

            expect(() => {
                return new Email(mandrillApiKey);
            }).toThrow(/service/i);

            expect(() => {
                return new Email(mandrillApiKey, 'Mandrill');
            }).toThrow(/service/i);

        });

        test('should work, if everything has been provided correctly', () => {

            const email = new Email(mandrillApiKey, emailServices.Mandrill);

            expect(email).toBeTruthy();
            expect(email.service).toBeTruthy();
            expect(email.service instanceof emailServices.Mandrill).toBe(true);

        });

        test('should work, when provided an instance of the Mandrill class', () => {

            const email = new Email(mandrillApiKey, emailServices.Mandrill);

            expect(email).toBeTruthy();
            expect(email.service).toBeTruthy();
            expect(email.service instanceof emailServices.Mandrill).toBe(true);

        });

    });

    describe('Mandrill', () => {

        describe('send', () => {

            test('should fail, if "html" and "text" is not provided', (done) => {

                const email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(() => {
                    email.send({}, () => {});
                }).toThrow('"message.html" and "message.text" is missing, one of these fields is required.');

                return done();

            });

            test('should fail, if "fromEmail" is not provided', (done) => {

                const email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(() => {
                    email.send({ html: '<p>hello</p>' }, () => {});
                }).toThrow('"message.fromEmail" field is either missing or is empty.');

                return done();

            });

            test('should fail, if "to" is not provided', (done) => {

                const email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(() => {
                    email.send({
                        'html': '<p>hello</p>',
                        'fromEmail': 'from@test.com'
                    }, () => {});
                }).toThrow('"message.to" field is either missing or is empty.');

                return done();

            });

            test('should fail, if "to" is not of type String or Array', (done) => {

                const email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(() => {
                    email.send({
                        'html': '<p>hello</p>',
                        'fromEmail': 'from@test.com',
                        'to': {}
                    }, () => {});
                }).toThrow('"message.to" must be of type String or Array.');

                return done();

            });

            test('should fail, if "to" (String) has an invalid email', (done) => {

                const email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(() => {
                    email.send({
                        'html': '<p>hello</p>',
                        'fromEmail': 'from@test.com',
                        'to': 'test@test'
                    }, () => {});
                }).toThrow('test@test is not a valid email address.');

                return done();

            });

            test('should fail, if "to" is an empty Array', (done) => {

                const email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(() => {
                    email.send({
                        'html': '<p>hello</p>',
                        'fromEmail': 'from@test.com',
                        'to': []
                    }, () => {});
                }).toThrow('"message.to" Array field is empty.');

                return done();

            });

            test('should fail, if "to" Array has a missing email field', (done) => {

                const email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(() => {
                    email.send({
                        'html': '<p>hello</p>',
                        'fromEmail': 'from@test.com',
                        'to': [{ name: 'test' }]
                    }, () => {});
                }).toThrow('Missing "email" field in one of the "message.to" Array.');

                return done();

            });

            test('should fail, if "to" Array has an invalid email', (done) => {

                const email = new Email(mandrillApiKey, emailServices.Mandrill);

                expect(() => {
                    email.send({
                        'html': '<p>hello</p>',
                        'fromEmail': 'from@test.com',
                        'to': [{
                            'name': 'test',
                            'email': 'test@test'
                        }]
                    }, () => {});
                }).toThrow('test@test is not a valid email address.');

                return done();

            });

            test('should support the sendAt property', (done) => {

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

                        expect(body).toMatch(/send_at":"2004/);
                        expect(body).not.toMatch(/sendAt/);

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
