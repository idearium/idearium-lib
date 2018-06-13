'use strict';

const mq = require('../lib/mq');
const conf = require('./conf');

describe('class mq.Client', () => {

    describe('will throw an Error', () => {

        it('if url is not provided', () => {

            try {

                new mq.Client();

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
                const ideariumMq = new mq.Client(conf.rabbitUrl);

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

});
