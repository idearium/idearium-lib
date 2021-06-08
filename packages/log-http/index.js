'use strict';

const pino = require('pino');
const http = require('pino-http');
const defaults = require('./defaults');

module.exports = (options = {}) =>
    http(
        Object.assign({}, defaults, options),
        options.stream || pino.destination(1)
    );
