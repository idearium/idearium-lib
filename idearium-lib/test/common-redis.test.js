'use strict';

jest.mock('/app/config/config.js', () => ({
    cacheUrl: '',
    logLevel: 'debug',
    logLocation: 'local',
    logToStdout: true,
}));

const Redis = require('../common/redis');

test('returns a redis client', () => {

    const redis = new Redis();

    expect(redis).toBeTruthy();
    expect(redis.constructor.name).toBe('Redis');

});

test('has a retry strategy function', () => {

    const redis = new Redis();

    expect(redis.options.retryStrategy(1)).toBe(2000);
    expect(redis.options.retryStrategy(5)).toBe(10000);

});

test('exits when the retry limit is reached', () => {

    const redis = new Redis();
    const mockExit = jest.fn();

    process.exit = mockExit;

    redis.options.retryStrategy(10);

    // Test exits with an exit code 1
    expect(mockExit.mock.calls.length).toBe(1);
    expect(mockExit.mock.calls[0][0]).toBe(1);

});
