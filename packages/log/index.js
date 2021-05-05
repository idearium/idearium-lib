'use strict';

const pino = require('pino');

const sourceLocationKey = 'logging.googleapis.com/sourceLocation';

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

module.exports = (options = {}) =>
    pino(
        Object.assign({}, defaults, options),
        options.stream || pino.destination(1)
    ).child({
        [`${sourceLocationKey}`]: options.sourceLocation || {
            file: Error()
                .stack.split('\n')
                .slice(2)
                .filter(
                    (s) =>
                        !s.includes('node_modules/pino') &&
                        !s.includes('node_modules\\pino')
                )[0]
                .match(/\((.*?):/)[1]
                .replace(__dirname, '')
        }
    });
