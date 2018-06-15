'use strict';

const mq = require('../lib/mq');
const conf = require('./conf');

describe('class mq.RpcServer', () => {

    describe('will throw an Error', () => {

        test('if url is not provided', () => {

            try {

                new mq.RpcServer();

            } catch (err) {

                expect(err.message).toMatch(/connectionString parameter is required/);

            }

        });

        test('if name is not provided', () => {

            try {

                new mq.RpcServer(conf.rabbitUrl);

            } catch (err) {

                expect(err.message).toMatch(/You must supply an RPC name/);

            }

        });

        test('if callback is not provided', () => {

            try {

                new mq.RpcServer(conf.rabbitUrl, 'test_name');

            } catch (err) {

                expect(err.message).toMatch(/You must supply a callback function/);

            }

        });

    });

    describe('connects to', () => {

        test('RabbitMQ and gracefully disconnects', (done) => {

            const name = 'test_server_queue';
            const callback = () => {};

            // Catch and proxy errors to `done`.
            try {

                // Setup an instance of the class.
                const ideariumRPC = new mq.RpcServer(conf.rabbitUrl, name, callback);

                // Add the connect listener. When this happens, we're done.
                ideariumRPC.addListener('channel', () => {

                    ideariumRPC.disconnect()
                        .then(() => done())
                        .catch(done);

                });

                // Listen for errors.
                ideariumRPC.addListener('error', done);

                // This usually comes from common/mq/client, but we're not using that so we'll need to do them here.
                // Setup and start the connection straight away.
                ideariumRPC.reconnectCount = 0;
                ideariumRPC.connect();

            } catch (e) {
                return done(e);
            }

        }, 10000);

    });

});
