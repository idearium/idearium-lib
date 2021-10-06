'use strict';

const Redis = require('ioredis');
const log = require('@idearium/log')();

/* eslint-disable no-process-env */
const retryDelay = parseInt(process.env.REDIS_RETRY_DELAY, 10) || 2000;
const retryLimit = parseInt(process.env.REDIS_RETRY_LIMIT, 10) || 10;
const cacheUrl = process.env.CACHE_URL;
/* eslint-enable no-process-env */

let connection;

const connect = (opts) => {
    if (connection) {
        return connection;
    }

    const redis = new Redis(cacheUrl, {
        retryStrategy: (times) => {
            if (times >= retryLimit) {
                log.fatal(
                    `Retry limit of ${retryLimit} reached, could not connect to Redis`
                );

                // eslint-disable-next-line no-process-exit
                return process.exit(1);
            }

            return times * retryDelay;
        },
        showFriendlyErrorStack: true,
        ...opts,
    });

    redis.on('close', () => log.info('Redis closed'));
    redis.on('connect', () => log.info('Redis connected'));
    redis.on('end', () => log.info('Redis ended'));
    redis.on('error', (err) => log.error({ err }, err.message));
    redis.on('ready', () => log.info('Redis ready'));
    redis.on('reconnecting', () => log.info('Redis reconnecting'));

    connection = redis;

    return redis;
};

module.exports = connect;
