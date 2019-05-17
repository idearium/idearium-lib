'use strict';

const pino = require('pino');

const logger = pino({
    enabled: process.env.LOG_ENABLED !== 'false',
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: process.env.LOG_REMOTE !== 'true' && process.env.PINO_PRETTY_PRINT !== 'false',
    redact: [
        '*.key',
        '*.member.password',
        '*.password',
        '*.token',
        '*.user.password',
        'key',
        'password',
        'token',
    ],
    serializers: pino.stdSerializers,
});

module.exports = logger.child({ context: require.main.filename });
