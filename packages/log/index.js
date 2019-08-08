'use strict';

const pino = require('pino');
const main = require('require-main-filename')();

let redactPaths = [
    '*.member.password',
    '*.password',
    '*.user.password',
    'password'
];

/* eslint-disable no-process-env */
if (process.env.PINO_REDACT_PATHS) {
    redactPaths = redactPaths.concat(process.env.PINO_REDACT_PATHS.split(','));
}

const defaults = {
    enabled: process.env.LOG_ENABLED !== 'false',
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint:
        process.env.LOG_REMOTE !== 'true' &&
        process.env.PINO_PRETTY_PRINT !== 'false',
    redact: redactPaths,
    serializers: pino.stdSerializers
};
/* eslint-enable no-process-env */

module.exports = pino(defaults).child({ context: main });

module.exports.init = (options = {}) => {
    return pino(Object.assign({}, defaults, options), options.stream).child({
        context: main
    });
};
