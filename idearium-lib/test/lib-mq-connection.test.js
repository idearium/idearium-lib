'use strict';

const mq = require('../lib/mq');
const conf = require('./conf');

describe('class mq.Connection', () => {

    describe('will throw an Error', () => {

        it('if url is not provided', () => {

            try {

                new mq.Connection();

            } catch (err) {

                expect(err.message).toMatch(/mqUrl parameter is required/);

            }

        });

    });

    describe('connects to', () => {

        it('RabbitMQ', (done) => {

            // Catch and proxy errors to `done`.
            try {

                // Setup an instance of the class.
                const ideariumMq = new mq.Connection(conf.rabbitUrl);

                // Add the connect listener. When this happens, we're done.
                ideariumMq.addListener('connect', () => {
                    return done();
                });

                // Listen for errors.
                ideariumMq.addListener('error', done);

                // This usually comes from common/mq/client, but we're not using that so we'll need to do them here.
                // Setup and start the connection straight away.
                ideariumMq.reconnectCount = 0;
                ideariumMq.connect();

            } catch (e) {

                return done(e);

            }

        }, 10000);

    });

    describe('gracefully disconnects', () => {

        it('when not connected', (done) => {

            // Setup an instance of the class.
            const ideariumMq = new mq.Connection(conf.rabbitUrl);

            ideariumMq.disconnect()
                .then(() => done())
                .catch(done);

        });

        it('from RabbitMQ', (done) => {

            // Catch and proxy errors to `done`.
            try {

                // Setup an instance of the class.
                var ideariumMq = new mq.Connection(conf.rabbitUrl);

                // Add the connect listener. When this happens, we're done.
                ideariumMq.addListener('connect', () => {

                    ideariumMq.disconnect()
                        .then(() => done())
                        .catch(done);

                });

                // Listen for errors.
                ideariumMq.addListener('error', done);

                // This usually comes from common/mq/client, but we're not using that so we'll need to do them here.
                // Setup and start the connection straight away.
                ideariumMq.reconnectCount = 0;
                ideariumMq.connect();

            } catch (e) {
                return done(e);
            }

        }, 10000);

    });

});
