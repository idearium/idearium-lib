#!/usr/bin/env node
'use strict';

const Logger = require('r7insight_node');
const pump = require('pump');
const split = require('split2');

/* eslint-disable no-process-env */
// Just return what was passed.
if (process.env.LOG_REMOTE !== 'true') {
    return pump(process.stdin, process.stdout);
}
/* eslint-enable no-process-env */

/* eslint-disable no-process-env */
const region = process.env.INSIGHT_OPS_REGION;
const token = process.env.INSIGHT_OPS_TOKEN;
/* eslint-enable no-process-env */

if (!region) {
    throw new Error('A region is required!');
}

if (!token) {
    throw new Error('A token is required!');
}

const { stream } = Logger.bunyanStream({
    region,
    token,
});

pump(process.stdin, split(), stream);
