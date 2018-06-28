'use strict';

const config = require('./config');
const Redis = require('ioredis');
const log = require('./log')('idearium-lib:common/redis');

Redis.Promise.onPossiblyUnhandledRejection(err => log.error({ err }, 'Unhandled Redis error'));

class IORedis {

    constructor () {

        // 10 x 2000ms is about 2 minutes
        const retryLimit = config.get('redisRetryLimit') || 10;
        const retryDelay = config.get('redisRetryDelay') || 2000;

        const redis = new Redis(config.get('cacheUrl'), {
            retryStrategy: (times) => {

                if (times >= retryLimit) {

                    log.fatal('Retry limit reached, could not connect to Redis');

                    // eslint-disable-next-line no-process-exit
                    return process.exit(1);

                }

                return times * retryDelay;

            },
        });

        redis.on('close', () => log.info('Redis closed'));
        redis.on('connect', () => log.info('Redis connected'));
        redis.on('end', () => log.info('Redis ended'));
        redis.on('error', err => log.error({ err }, err.message));
        redis.on('ready', () => log.info('Redis ready'));
        redis.on('reconnecting', () => log.info('Redis reconnecting'));

        return redis;

    }

}

module.exports = IORedis;
