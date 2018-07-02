'use strict';

const amqp = require('amqplib');
const certs = require('./certs');
const config = require('../config');
const log = require('../log')('idearium-lib:common/mq/rpc-server');
const mq = require('../../lib/mq');

const retryLimit = config.get('rabbitmqRetryLimit') || 10;

/**
 * A common implement of mq.RPC to be used across many clients.
 */
class RpcServer extends mq.RpcServer {

    constructor (name, callback) {

        // Make sure we have a URL to connect to RabbitMQ.
        if (!config.get('mqUrl')) {
            throw new Error('The RabbitMQ connection url must be provided in an environment variable called mqUrl.');
        }

        // Make sure we have a URL to connect to RabbitMQ.
        if (!name) {
            throw new Error('The RabbitMQ server queue name must be provided.');
        }

        // Make sure we have a callback.
        if (!callback) {
            throw new Error('A callback function must be provided.');
        }

        // Configure the MqClient class.
        super(config.get('mqUrl'), name, callback);

        // We'll customise the reconnection strategy from MqClient.
        this.reconnectCount = 0;

        this.on('connect', () => {

            // Reset the count and reconnect.
            this.reconnectCount = 0;
            this.setupRpc();

        });

        // Once the certs have loaded, we'll update the options and connect.
        certs.then((optionsCerts) => {

            // Update options (for RabbitMQ connection) without certs.
            Object.assign(this.options, optionsCerts);

            // Connect even if there was an ENOENT error.
            this.connect();

        });

    }

    static logError (err) {
        log.error({ err }, err.message);
    }

    reconnect () {
        super.reconnect(parseInt(Math.pow(2, this.reconnectCount += 1), 10) * 1000);
    }

    /**
     * Establish a connection to RabbitMQ and attempt to reconnect if it fails.
     * @param {String} url The RabbitMQ url.
     * @return {Void} Connects to MQ.
     */
    connect () {

        // We don't need to connect if we already are.
        if (this.state === 'connected' || this.state === 'connecting') {
            return;
        }

        // Update the state
        this.state = 'connecting';

        // Delay for 1 second to prevent TLS errors on startup.
        setTimeout(() => {

            amqp.connect(this.mqUrl, this.options)
                .then((conn) => {

                    // Handle dropped connections.
                    conn.on('close', () => {

                        log.info('RabbitMQ RPC connection dropped, retrying...');

                        this.retry();

                    });

                    conn.on('error', (err) => {

                        log.error({ err }, err.message);

                        this.retry();

                    });

                    this.hasConnected(conn);

                })
                .catch((err) => {

                    log.error({ err }, err.message);

                    this.retry();

                });

        }, 1000);

    }

    retry () {

        if (this.reconnectCount >= retryLimit) {

            log.fatal('Retry limit reached, could not connect to RabbitMQ');

            // eslint-disable-next-line no-process-exit
            return process.exit(1);

        }

        this.reconnect();

    }

}

module.exports = RpcServer;
