'use strict';

const config = require('./config');
const kue = require('kue');
const client = require('./redis');
const log = require('./log')('idearium-lib:common/kue-queue');

if (!config.get('kuePrefix')) {
    throw new Error('You must define a configuration called \'kuePrefix\' to determine which KUE queue should be used.');
}

const queue = kue.createQueue({
    prefix: config.get('kuePrefix'),
    redis: { createClientFactory: () => client },
});

queue.exception = err => log.error({ err }, err.message);

queue.on('error', queue.exception);

module.exports = queue;
