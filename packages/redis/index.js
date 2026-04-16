'use strict';

const Redis = require('ioredis');
const log = require('@idearium/log')();

/* eslint-disable no-process-env */
const retryDelay = parseInt(process.env.REDIS_RETRY_DELAY, 10) || 2000;
const retryLimit = parseInt(process.env.REDIS_RETRY_LIMIT, 10) || 10;
const cacheUrl = process.env.CACHE_URL;
/* eslint-enable no-process-env */

const connections = [];

const removeConnection = (redis) => {
    const index = connections.indexOf(redis);

    if (index !== -1) {
        connections.splice(index, 1);
    }
};

const connect = (opts = {}) => {
    const reuse = typeof opts.reuse === 'undefined' ? false : opts.reuse;
    const reuseIndex =
        typeof opts.reuseIndex === 'undefined' ? 0 : opts.reuseIndex;

    if (reuse && connections.length > 0 && connections[reuseIndex]) {
        return connections[reuseIndex];
    }

    if (!cacheUrl) {
        throw new Error('CACHE_URL environment variable is required');
    }

    delete opts.reuse;
    delete opts.reuseIndex;

    const redis = new Redis(cacheUrl, {
        retryStrategy: (times) => {
            if (times >= retryLimit) {
                log.fatal(
                    `Retry limit of ${retryLimit} reached, could not connect to Redis`,
                );

                // eslint-disable-next-line no-process-exit
                return process.exit(1);
            }

            return times * retryDelay;
        },
        showFriendlyErrorStack: true,
        ...opts,
    });

    redis.on('close', () => {
        log.trace('Redis closed');
        removeConnection(redis);
    });
    redis.on('connect', () => log.trace('Redis connected'));
    redis.on('end', () => {
        log.trace('Redis ended');
        removeConnection(redis);
    });
    redis.on('error', (err) => log.error({ err }, err.message));
    redis.on('ready', () => log.trace('Redis ready'));
    redis.on('reconnecting', () => log.trace('Redis reconnecting'));

    connections.push(redis);

    return redis;
};

module.exports = connect;
