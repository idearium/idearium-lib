'use strict';

const config = require('./config');
const kue = require('kue');
const client = require('./redis');

if (!config.get('kuePrefix')) {
    throw new Error('You must define a configuration called \'kuePrefix\' to determine which KUE queue should be used.');
}

// https://github.com/Automattic/kue#replacing-redis-client-module
module.exports = kue.createQueue({ redis: { createClientFactory: () => client } });
