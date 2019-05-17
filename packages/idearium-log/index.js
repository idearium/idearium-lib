'use strict';

const pino = require('pino');

let redactPaths = [
    '*.member.password',
    '*.password',
    '*.user.password',
    'password',
];

/* eslint-disable no-process-env */
if (process.env.PINO_REDACT_PATHS) {
    redactPaths = redactPaths.concat(process.env.PINO_REDACT_PATHS.split(','));
}

const logger = pino({
    enabled: process.env.LOG_ENABLED !== 'false',
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: process.env.LOG_REMOTE !== 'true' && process.env.PINO_PRETTY_PRINT !== 'false',
    redact: redactPaths,
    serializers: pino.stdSerializers,
});
/* eslint-enable no-process-env */

module.exports = logger.child({ context: require.main.filename });
