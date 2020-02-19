'use strict';

const pino = require('pino');
const main = require('require-main-filename')();

const redactPathsDefaults = [
    '*.member.password',
    '*.password',
    '*.user.password',
    'password'
];

/* eslint-disable no-process-env */
const defaults = {
    enabled: process.env.LOG_ENABLED !== 'false',
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint:
        process.env.LOG_REMOTE !== 'true' &&
        process.env.PINO_PRETTY_PRINT !== 'false',
    redact: process.env.PINO_REDACT_PATHS
        ? redactPathsDefaults.concat(process.env.PINO_REDACT_PATHS.split(','))
        : redactPathsDefaults,
    serializers: pino.stdSerializers
};
/* eslint-enable no-process-env */

module.exports = (options = {}) => {
    return pino(
        Object.assign({}, defaults, options),
        options.stream || pino.destination(1)
    ).child({
        context: main
    });
};
