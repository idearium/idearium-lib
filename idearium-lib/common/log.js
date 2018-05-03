'use strict';

const config = require('./config');
const env = config.get('env');
const { isDevelopment } = require('../lib/util');
const pino = require('pino');

const options = {
    crlf: config.get('pinoCrlf') || false,
    enabled: config.get('pinoEnabled') || true,
    extreme: config.get('pinoExtreme') || false,
    level: config.get('pinoLevel') || 'debug',
    levelVal: config.get('pinoLevelVal'),
    messageKey: config.get('pinoMessageKey') || 'msg',
    name: config.get('pinoName'),
    prettyPrint: config.get('pinoPrettyPrint') || isDevelopment(env),
    safe: config.get('pinoSafe') || true,
    serializers: Object.assign({}, pino.stdSerializers, config.get('pinoSerializers')),
    timestamp: config.get('pinoTimestamp') || true,
};

if (options.extreme && config.get('pinoOnTerminated')) {
    options.onTerminated = config.get('pinoOnTerminated');
}

if (config.get('pinoBase')) {
    options.base = config.get('pinoBase');
}

const stream = config.get('pinoStream') || process.stdout;
const log = pino(options, stream);

const createLogger = (context = '') => log.child({ context });

module.exports = createLogger;
