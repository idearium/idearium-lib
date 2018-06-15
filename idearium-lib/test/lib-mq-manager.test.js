'use strict';

/* eslint-env node, mocha */

const path = require('path');
const fs = require('fs');
const dir = path.resolve(__dirname, '..', 'lib-mq-manager');

const mq = require('../lib/mq');

describe('class mq.Manager', () => {

    beforeAll((done) => {

        fs.mkdir(dir, () => {

            fs.writeFile(path.join(dir, 'test.js'), 'module.exports = { "consume": "" };', done);

        });

    });

    describe('will throw an Error', () => {

        test('if a path is not provided', () => {

            try {

                new mq.Manager();

            } catch (err) {

                expect(err.message).toMatch(/path parameter is required/);

            }

        });

    });

    describe('with the messages directory', () => {

        test('will load messages and fire an event', (done) => {

            const mqManager = new mq.Manager(dir);

            mqManager.addListener('load', () => {

                expect(Object.keys(mqManager.messages).sort()).toEqual(['test']);

                return done();

            });

        });

        test('will execute consumers', (done) => {

            const mqManager = new mq.Manager(dir);

            require(path.join(dir, 'test.js')).consume = () => {
                return done();
            };

            mqManager.addListener('load', () => {
                mqManager.registerConsumers();
            });

        });

        test('will publish a message', (done) => {

            const mqManager = new mq.Manager(dir);

            require(path.join(dir, 'test.js')).publish = function (data) {

                expect(data).toEqual({ 'will-publish-a-message': true });

                return done();

            };

            mqManager.addListener('load', () => {
                mqManager.publish('test', {'will-publish-a-message': true});
            });

        });


    });

    describe('publish', () => {

        test('will return a resolved promise', (done) => {

            const mqManager = new mq.Manager(dir);

            // eslint-disable-next-line global-require
            require(path.join(dir, 'test.js')).publish = () => Promise.resolve();

            mqManager.addListener('load', () => {

                const publishResult = mqManager.publish('test', { 'will-publish-a-message': true });

                expect(publishResult instanceof Promise).toBe(true);

                publishResult
                    .then(() => done())
                    .catch(done);

            });

        });

        test('will return a rejected promise', (done) => {

            const mqManager = new mq.Manager(dir);

            // eslint-disable-next-line global-require
            require(path.join(dir, 'test.js')).publish = () => Promise.reject(new Error('Rejected.'));

            mqManager.addListener('load', () => {

                const publishResult = mqManager.publish('test', { 'will-publish-a-message': true });

                expect(publishResult instanceof Promise).toBe(true);

                publishResult
                    .then(() => done(new Error('Should not have resolved')))
                    .catch(() => done());

            });

        });

        test('will create and return a resolved promise', (done) => {

            const mqManager = new mq.Manager(dir);

            // eslint-disable-next-line global-require, no-empty-function
            require(path.join(dir, 'test.js')).publish = () => {};

            mqManager.addListener('load', () => {

                const publishResult = mqManager.publish('test', { 'will-publish-a-message': true });

                expect(publishResult instanceof Promise).toBe(true);

                publishResult
                    .then(() => done())
                    .catch(done);

            });

        });

        test('will reject publishing missing message types', (done) => {

            const mqManager = new mq.Manager(dir);

            mqManager.addListener('load', () => {

                const publishResult = mqManager.publish('test-missing-message', {});

                expect(publishResult instanceof Promise).toBe(true);

                publishResult
                    .then(() => done(new Error('Should not have resolved.')))
                    .catch(() => done());

            });

        });

        test('will reject publishing messages without a publish function', (done) => {

            const mqManager = new mq.Manager(dir);
            // eslint-disable-next-line global-require
            const message = require(path.join(dir, 'test.js'));

            delete message.publish;

            mqManager.addListener('load', () => {

                const publishResult = mqManager.publish('test', {});

                expect(publishResult instanceof Promise).toBe(true);

                publishResult
                    .then(() => done(new Error('Should not have resolved.')))
                    .catch(() => done());

            });

        });

    });

    afterAll((done) => {

        fs.unlink(path.join(dir, 'test.js'), () => {

            fs.rmdir(dir, done);

        });

    });

});
