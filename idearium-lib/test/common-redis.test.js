'use strict';

jest.mock('/app/config/config.js', () => ({
    cacheUrl: '',
    logLevel: 'debug',
    logLocation: 'local',
    logToStdout: true,
}));

const redis = require('../common/redis');

test('returns a redis client', () => {

    expect(redis).toBeTruthy();
    expect(redis.constructor.name).toBe('Redis');

});

test('has a retry strategy function', () => {

    expect(redis.options.retryStrategy(1)).toBe(2000);
    expect(redis.options.retryStrategy(5)).toBe(10000);

});

test('exits when the retry limit is reached', () => {

    const mockExit = jest.fn();

    process.exit = mockExit;

    redis.options.retryStrategy(10);

    // Test exits with an exit code 1
    expect(mockExit.mock.calls.length).toBe(1);
    expect(mockExit.mock.calls[0][0]).toBe(1);

});
