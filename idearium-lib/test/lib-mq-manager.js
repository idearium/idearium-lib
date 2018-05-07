'use strict';

/* eslint-env node, mocha */

const path = require('path');
const fs = require('fs');
const dir = path.resolve(__dirname, '..', 'lib-mq-manager');

const mq = require('../lib/mq');
const { expect } = require('chai');

describe('class mq.Manager', function () {

    before(function (done) {

        fs.mkdir(dir, function () {

            fs.writeFile(path.join(dir, 'test.js'), 'module.exports = { "consume": "" };', done);

        });

    });

    describe('will throw an Error', function () {

        it('if a path is not provided', function () {

            const fn = () => {

                // eslint-disable-next-line no-unused-vars
                const ideariumMq = new mq.Manager();

            };

            expect(fn).to.throw(Error, /path parameter is required/);

        });

    });

    describe('with the messages directory', function () {

        it('will load messages and fire an event', function (done) {

            var mqManager = new mq.Manager(dir);

            mqManager.addListener('load', function () {
                expect(mqManager.messages).to.have.keys('test');
                return done();
            });

        });

        it('will execute consumers', function (done) {

            var mqManager = new mq.Manager(dir);

            require(path.join(dir, 'test.js')).consume = function () {
                return done();
            };

            mqManager.addListener('load', function () {
                mqManager.registerConsumers();
            });

        });

        it('will publish a message', function (done) {

            var mqManager = new mq.Manager(dir);

            require(path.join(dir, 'test.js')).publish = function (data) {

                expect(data).to.eql({'will-publish-a-message': true});
                return done();

            };

            mqManager.addListener('load', function () {
                mqManager.publish('test', {'will-publish-a-message': true});
            });

        });


    });

    describe('publish', function () {

        it('will return a resolved promise', function (done) {

            const mqManager = new mq.Manager(dir);

            // eslint-disable-next-line global-require
            require(path.join(dir, 'test.js')).publish = () => Promise.resolve();

            mqManager.addListener('load', function () {

                const publishResult = mqManager.publish('test', { 'will-publish-a-message': true });

                expect(publishResult instanceof Promise).to.be.true;

                publishResult
                    .then(() => done())
                    .catch(done);

            });

        });

        it('will return a rejected promise', function (done) {

            const mqManager = new mq.Manager(dir);

            // eslint-disable-next-line global-require
            require(path.join(dir, 'test.js')).publish = () => Promise.reject(new Error('Rejected.'));

            mqManager.addListener('load', function () {

                const publishResult = mqManager.publish('test', { 'will-publish-a-message': true });

                expect(publishResult instanceof Promise).to.be.true;

                publishResult
                    .then(() => done(new Error('Should not have resolved')))
                    .catch(() => done());

            });

        });

        it('will create and return a resolved promise', function (done) {

            const mqManager = new mq.Manager(dir);

            // eslint-disable-next-line global-require, no-empty-function
            require(path.join(dir, 'test.js')).publish = () => {};

            mqManager.addListener('load', function () {

                const publishResult = mqManager.publish('test', { 'will-publish-a-message': true });

                expect(publishResult instanceof Promise).to.be.true;

                publishResult
                    .then(() => done())
                    .catch(done);

            });

        });

        it('will reject publishing missing message types', function (done) {

            const mqManager = new mq.Manager(dir);

            mqManager.addListener('load', function () {

                const publishResult = mqManager.publish('test-missing-message', {});

                expect(publishResult instanceof Promise).to.be.true;

                publishResult
                    .then(() => done(new Error('Should not have resolved.')))
                    .catch(() => done());

            });

        });

        it('will reject publishing messages without a publish function', function (done) {

            const mqManager = new mq.Manager(dir);
            // eslint-disable-next-line global-require
            const message = require(path.join(dir, 'test.js'));

            delete message.publish;

            mqManager.addListener('load', function () {

                const publishResult = mqManager.publish('test', {});

                expect(publishResult instanceof Promise).to.be.true;

                publishResult
                    .then(() => done(new Error('Should not have resolved.')))
                    .catch(() => done());

            });

        });

    });

    after(function (done) {

        fs.unlink(path.join(dir, 'test.js'), function () {

            fs.rmdir(dir, done);

        });

    });

});
