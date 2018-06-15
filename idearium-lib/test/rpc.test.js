'use strict';

jest.mock('/app/config/config.js', () => ({ mqUrl: require('./conf').rabbitUrl }));

const path = require('path');
const copy = require('copy-dir');
const rimraf = require('rimraf');
const dir = path.resolve(__dirname);

describe('RPC', function () {

    // This is run after common-config and will have therefore cached the config from the previous test.
    // Set the mqUrl value as common/mq/client uses it.
    beforeAll((done) => {

        // Move the test files into place
        copy(path.resolve(dir, 'data', 'mq-certs'), path.join(dir, '..', 'mq-certs', process.env.NODE_ENV), done);

    });

    test('will send and receive messages', (done) => {

        // Catch and proxy errors to `done`.
        try {

            //
            // Common
            //

            const data = {
                'array': [],
                'boolean': true,
                'object': {},
                'random': Math.floor(Math.random() * 40000),
            };

            const rpcName = 'rpc_server_name';

            //
            // Setup the server.
            //

            const reply = (msg, callback) => {

                const msgData = JSON.parse(msg.content.toString());

                expect(msgData).toEqual(data);
                callback(msg.content);

            };

            const RpcServer = require('../common/mq/rpc-server');

            const rpcServer = new RpcServer(rpcName, reply);

            // Listen for errors.
            rpcServer.addListener('error', done);

            //
            // Setup the client.
            //

            // Setup an instance of the class.
            const rpcClient = require('../common/mq/rpc-client');

            // Add the connect listener. When this happens, we're done.
            rpcClient.addListener('queue', () => {

                rpcClient.publish(rpcName, data)
                    .then((result) => {

                        const msgData = JSON.parse(result.content.toString());

                        expect(msgData).toEqual(data);

                        return done();

                    })
                    .catch(done);

            });

            // Listen for errors.
            rpcClient.addListener('error', done);

        } catch (e) {
            return done(e);
        }

    }, 10000);

    afterAll((done) => {

        rimraf(path.join(dir, '..', 'mq-certs'), done);

    });

});
