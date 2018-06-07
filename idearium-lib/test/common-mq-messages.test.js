/* eslint-env node, mocha */

'use strict';

jest.mock('/app/config/config.js', () => ({ env: 'test' }));
jest.mock('../messages/index.js', () => ({ consume: () => Promise.resolve(), publish: () => Promise.resolve() }));

const path = require('path'),
    fs = require('fs'),
    dir = path.resolve(__dirname, '..', 'messages'),
    conf = require('./conf');

describe('common/mq/messages', () => {

    let message;

    // This is run after common-mq-client and will have therefore cached the config from the previous test.
    // Set the mqUrl value as common/mq/client uses it.
    beforeAll(() => {

        require('../common/config').set('mqUrl', conf.rabbitUrl);

        // Add some fake messages to load.
        // eslint-disable-next-line global-require
        message = require('../messages');

    });

    it('will faciliate producing and consuming messages', (done) => {

        var exchange = 'common-mq-messages',
            queueName = 'common-mq-messages-queue',
            mqClient = require('../common/mq/client');

        // This runs after test/common-mq-client.
        // That means some things have been cached.
        // The following test has been setup to accomodate that.

        // Recreate the consume function.
        message.consume = function consumeTest () {

            mqClient.consume((channel) => {

                var processMessage = (msg) => {

                        // For the purpose of this test case, instantly acknowledge the message.
                        channel.ack(msg);

                        // Try and pass the data.
                        try {
                            var data = JSON.parse(msg.content.toString());
                        } catch (e) {
                            return done(e);
                        }

                        if (!data) {
                            return done(new Error('There was no data'));
                        }

                        expect(data).toEqual({'common-mq-messages-test': true});

                        return done();

                    };

                // create exchange, durable make sure exchange will persist to disk
                return channel.assertExchange(exchange, 'fanout', { durable: true })
                .then(() => {
                    // create queue, durable make sure queue will persist to disk
                    return channel.assertQueue(queueName, { durable: true });
                })
                .then(() => {
                    // bind queue to exchange, with empty string as the routing key since the exchange type is 'fanout'
                    return channel.bindQueue(queueName, exchange, '');
                })
                .then(() => {
                    // consume and process the message, noAck tells rabbitmq to wait for aknowledgement
                    return channel.consume(queueName, processMessage, { noAck: false });
                });

            });

        };

        // Create the publish function.
        message.publish = function publishTest (data) {

            // Publish anything we receive into RabbitMQ.
            mqClient.publish((channel) => {

                // create exchange, durable make sure exchange will persist to disk
                return channel.assertExchange(exchange, 'fanout', { durable: true })
                .then(() => {
                    // publish message to exchange, persistent settings ensure message is saved to disk in case of server failure
                    return channel.publish(exchange, '', new Buffer(JSON.stringify(data)), { persistent: true });
                });

            });

        };

        // Catch and proxy any errors to `done`.
        try {

            // This will be cached.
            let mqMessages = require('../common/mq/messages');

            // Wait until everything is loaded.
            mqMessages.addListener('load', () => {

                // Wait until everything is connected again.
                mqClient.addListener('connect', () => {

                    // Publish a test message.
                    require('../messages').publish({'common-mq-messages-test': true});

                });

                // Handle any errors.
                mqClient.addListener('error', done);

                // Run this manually, as it will have already run once.
                return mqMessages.registerConsumers()
                    .then(() => mqClient.reconnect());

            });

        } catch (e) {
            return done(e);
        }

    }, 10000);

});
