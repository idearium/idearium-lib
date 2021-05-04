'use strict';

const pino = require('pino');
const main = require('require-main-filename')();

const pinoLevelToSeverity = {
    /* eslint-disable sort-keys */
    trace: 'DEBUG',
    debug: 'DEBUG',
    info: 'INFO',
    warn: 'WARNING',
    error: 'ERROR',
    fatal: 'CRITICAL'
    /* eslint-enable sort-keys */
};

const redactPathsDefaults = [
    '*.member.password',
    '*.password',
    '*.user.password',
    'password'
];

const levelFormatter = (label, number) => ({
    level: number,
    severity: pinoLevelToSeverity[label] || pinoLevelToSeverity.info
});

/* eslint-disable no-process-env */
const defaults = {
    base: null,
    enabled: process.env.LOG_ENABLED !== 'false',
    formatters: {
        level: levelFormatter
    },
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: process.env.LOG_PRETTY_PRINT === 'true',
    redact: process.env.LOG_REDACT_PATHS
        ? redactPathsDefaults.concat(process.env.LOG_REDACT_PATHS.split(','))
        : redactPathsDefaults,
    serializers: pino.stdSerializers,
    timestamp: pino.stdTimeFunctions.isoTime
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
