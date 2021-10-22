'use strict';

const pino = require('pino');

const pinoLevelToSeverity = {
    /* eslint-disable sort-keys */
    trace: 'DEBUG',
    debug: 'DEBUG',
    info: 'INFO',
    warn: 'WARNING',
    error: 'ERROR',
    fatal: 'CRITICAL',
    /* eslint-enable sort-keys */
};

const redactPathsDefaults = [
    '*.member.password',
    '*.password',
    '*.user.password',
    'password',
];

const levelFormatter = (label, number) => ({
    level: number,
    severity: pinoLevelToSeverity[label] || pinoLevelToSeverity.info,
});

const logFormatter = (object) => {
    if (typeof object.span_id !== 'undefined') {
        object.spanId = object.span_id;
        delete object.span_id;
    }

    if (typeof object.trace_id !== 'undefined') {
        object.traceId = object.trace_id;
        delete object.trace_id;
    }

    return object;
};

/* eslint-disable no-process-env */
module.exports = {
    base: null,
    enabled: process.env.LOG_ENABLED !== 'false',
    formatters: {
        level: levelFormatter,
        log: logFormatter,
    },
    level: process.env.LOG_LEVEL || 'info',
    messageKey: 'message',
    prettyPrint: false,
    redact: process.env.LOG_REDACT_PATHS
        ? redactPathsDefaults.concat(process.env.LOG_REDACT_PATHS.split(','))
        : redactPathsDefaults,
    serializers: pino.stdSerializers,
    timestamp: pino.stdTimeFunctions.isoTime,
};
/* eslint-enable no-process-env */
