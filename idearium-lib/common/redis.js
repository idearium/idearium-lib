'use strict';

const config = require('./config');
const redis = require('redis');

if (!config.get('kuePrefix')) {
    throw new Error('You must define a configuration called \'kuePrefix\' to determine which KUE queue should be used.');
}

const client = redis.createClient({
    prefix: config.get('kuePrefix'),
    // https://github.com/NodeRedis/node_redis#rediscreateclient
    // eslint-disable-next-line camelcase
    retry_strategy: (options = {}) => {

        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            return new Error('The server refused the connection');
        }

        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
        }

        if (options.attempt > 10) {
            // End reconnecting with built in error
            return;
        }

        // Reconnect after
        return Math.min(options.attempt * 100, 3000);

    },
    url: config.get('cacheUrl'),
});

module.exports = client;
