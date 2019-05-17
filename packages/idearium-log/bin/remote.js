#!/usr/bin/env node

const Logger = require('r7insight_node');
const pump = require('pump');
const split = require('split2');

const region = process.env.INSIGHT_OPS_REGION;
const token = process.env.INSIGHT_OPS_TOKEN;

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
