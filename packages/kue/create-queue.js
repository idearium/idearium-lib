'use strict';

const kue = require('kue');
const log = require('@idearium/log')();
const redis = require('@idearium/redis');

const connect = (opts = {}) => {
    const prefix = process.env.KUE_PREFIX;

    if (!(prefix || opts.prefix)) {
        throw new Error(
            'You must define an environment variable called KUE_PREFIX or set the prefix option.'
        );
    }

    const queue = kue.createQueue({
        prefix,
        redis: { createClientFactory: () => redis() },
        ...opts,
    });

    queue.exception = (err) => log.error({ err }, err.message);

    queue.on('error', queue.exception);

    return queue;
};

module.exports = connect;
