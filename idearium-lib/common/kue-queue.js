'use strict';

const kue = require('kue');
const client = require('./redis');

// https://github.com/Automattic/kue#replacing-redis-client-module
module.exports = kue.createQueue({ redis: { createClientFactory: () => client } });
