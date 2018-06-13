'use strict';

const mq = require('../lib/mq');
const conf = require('./conf');

describe('class mq.RpcClient', () => {

    describe('will throw an Error', () => {

        it('if url is not provided', () => {

            try {

                new mq.RpcClient();

            } catch (err) {

                expect(err.message).toMatch(/connectionString parameter is required/);

            }

        });

    });

    describe('connects to', () => {

        it('RabbitMQ and gracefully disconnects', (done) => {

            // Catch and proxy errors to `done`.
            try {

                // Setup an instance of the class.
                const ideariumRPC = new mq.RpcClient(conf.rabbitUrl);

                // Add the connect listener. When this happens, we're done.
                ideariumRPC.addListener('queue', () => {

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

        }, 6000);

    });

    describe('RPC calls', () => {

        it('will timeout', (done) => {

            // Catch and proxy errors to `done`.
            try {

                // Setup an instance of the class.
                const ideariumRPC = new mq.RpcClient(conf.rabbitUrl, {}, 1000);

                // Add the connect listener. When this happens, we're done.
                ideariumRPC.addListener('queue', () => {

                    ideariumRPC.publish('missing-rpc', {})
                        .then(() => done(new Error('Should not have resolved.')))
                        .catch((err) => {

                            expect(err instanceof Error).toBe(true);
                            expect(err.message).toMatch(/RPC timed out/);

                            return done();

                        });

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

        });

        describe('can have', () => {

            it('custom global timeout values', (done) => {

                // Catch and proxy errors to `done`.
                try {

                    // Setup an instance of the class.
                    const ideariumRPC = new mq.RpcClient(conf.rabbitUrl, {}, 500);
                    const now = process.hrtime();

                    // Add the connect listener. When this happens, we're done.
                    ideariumRPC.addListener('queue', () => {

                        ideariumRPC.publish('missing-rpc', {})
                            .then(() => done(new Error('Should not have been resolved.')))
                            .catch(() => {

                                expect((process.hrtime(now)[1]/1000000) < 600).toBe(true);

                                done();

                            });

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

            });

            it('timeout values specific to RPC', (done) => {

                // Catch and proxy errors to `done`.
                try {

                    // Setup an instance of the class.
                    // Global timeout of 10000
                    const ideariumRPC = new mq.RpcClient(conf.rabbitUrl, {}, 2000);
                    const now = process.hrtime();
                    let firstTimeout = false;
                    let secondTimeout = false;

                    // Add the connect listener. When this happens, we're done.
                    ideariumRPC.addListener('queue', () => {

                        ideariumRPC.publish('missing-rpc-1', {})
                            .then(() => done(new Error('Should not have been resolved.')))
                            .catch((err) => {

                                firstTimeout = true;

                                expect(secondTimeout).toBe(true);

                                expect(err instanceof Error).toBe(true);
                                expect(err.message).toMatch(/RPC timed out \(missing-rpc-1/);

                                return done();

                            });

                        ideariumRPC.publish('missing-rpc-2', {}, 500)
                            .then(() => done(new Error('Should not have been resolved.')))
                            .catch((err) => {

                                secondTimeout = true;

                                expect(firstTimeout).toBe(false);
                                expect((process.hrtime(now)[1] / 1000000) < 600).toBe(true);

                                expect(err instanceof Error).toBe(true);
                                expect(err.message).toMatch(/RPC timed out \(missing-rpc-2/);

                                return done();

                            });

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

            }, 4000);

        });

    });

});
