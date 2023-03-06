'use strict';

const path = require('path');
const { collect, once, sink } = require('./lib');

const sourceLocation = 'logging.googleapis.com/sourceLocation';
const processEnv = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = Object.assign({}, processEnv);
});

afterEach(() => {
    process.env = processEnv;
});

test('logs to the console', async () => {
    expect.assertions(4);

    const stream = sink();
    const log = require('../multi')({ stream });

    log({ info: { info: true, logLevel: 'info' } }, 'test');

    const result = await once(stream, 'data');

    expect(result.level).toBe(30);
    expect(result.message).toBe('test');
    expect(result.info).toEqual(true);
    expect(result.logLevel).toEqual('info');
});

test('does not log if "LOG_ENABLED" is set to "false"', async () => {
    expect.assertions(1);

    process.env.LOG_ENABLED = 'false';

    const log = require('../multi')();

    expect(log({ info: { info: true, logLevel: 'info' } }, 'test')).toBe(null);
});

test('returns the data and level logged at', async () => {
    expect.assertions(6);

    const testLevel = (level) => {
        const stream = sink();
        const log = require('../multi')({ level, stream });

        return log(
            {
                trace: { trace: true },
                debug: { debug: true },
                info: { info: true },
                warn: { warn: true },
                error: { error: true },
                fatal: { fatal: true },
            },
            'test'
        );
    };

    const traceLevel = testLevel('trace');
    const debugLevel = testLevel('debug');
    const infoLevel = testLevel('info');
    const warnLevel = testLevel('warn');
    const errorLevel = testLevel('error');
    const fatalLevel = testLevel('fatal');

    expect(traceLevel).toEqual({
        data: {
            trace: true,
            debug: true,
            info: true,
            warn: true,
            error: true,
            fatal: true,
        },
        level: 'fatal',
    });
    expect(debugLevel).toEqual({
        data: {
            debug: true,
            info: true,
            warn: true,
            error: true,
            fatal: true,
        },
        level: 'fatal',
    });
    expect(infoLevel).toEqual({
        data: {
            info: true,
            warn: true,
            error: true,
            fatal: true,
        },
        level: 'fatal',
    });
    expect(warnLevel).toEqual({
        data: {
            warn: true,
            error: true,
            fatal: true,
        },
        level: 'fatal',
    });
    expect(errorLevel).toEqual({
        data: {
            error: true,
            fatal: true,
        },
        level: 'fatal',
    });
    expect(fatalLevel).toEqual({
        data: {
            fatal: true,
        },
        level: 'fatal',
    });
});

test('the log level is represented by the highest log level in the data', async () => {
    expect.assertions(6);

    const stream = sink();
    const log = require('../multi')({ stream });

    log(
        { info: { info: true, logLevel: 'info' }, warn: { warn: 'warn' } },
        'test'
    );

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('severity', 'WARNING');
    expect(result).toHaveProperty('level', 40);
    expect(result).toHaveProperty('message', 'test');
    expect(result).toHaveProperty('info', true);
    expect(result).toHaveProperty('logLevel', 'info');
    expect(result).toHaveProperty('warn', 'warn');
});

test('only logs level appropriate data', async () => {
    expect.assertions(72);

    const stream = sink();

    const testLevel = (level, data) => {
        const log = require('../multi')({ level, stream });

        return log(data, level);
    };

    testLevel('debug', {
        debug: { debug: 'debug' },
    });

    testLevel('debug', {
        debug: { debug: 'debug' },
        info: { info: 'info' },
    });

    testLevel('info', {
        trace: { trace: 'trace' },
        debug: { debug: 'debug' },
        info: { info: 'info' },
    });

    testLevel('error', {
        debug: { debug: 'debug' },
        error: { error: 'error' },
    });

    testLevel('debug', {
        debug: { debug: 'debug' },
        error: { error: 'error' },
    });

    testLevel('warn', {
        debug: { debug: 'debug' },
        warn: { warn: 'warn' },
        error: { error: 'error' },
    });

    testLevel('info', {
        debug: { debug: 'debug' },
        error: { error: 'error' },
    });

    testLevel('debug', {
        debug: { debug: 'debug' },
        error: { error: 'error' },
    });

    const [one, two, three, four, five, six, seven, eight] = await collect(
        stream,
        'data',
        7
    );

    expect(one).toHaveProperty('severity', 'DEBUG');
    expect(one).toHaveProperty('level', 20);
    expect(one).toHaveProperty('debug', 'debug');
    expect(one).toHaveProperty('message', 'debug');
    expect(one).not.toHaveProperty('info');
    expect(one).not.toHaveProperty('warn');
    expect(one).not.toHaveProperty('error');
    expect(one).not.toHaveProperty('fatal');
    expect(one).not.toHaveProperty('trace');

    expect(two).toHaveProperty('severity', 'INFO');
    expect(two).toHaveProperty('level', 30);
    expect(two).toHaveProperty('debug', 'debug');
    expect(two).toHaveProperty('info', 'info');
    expect(two).toHaveProperty('message', 'debug');
    expect(two).not.toHaveProperty('warn');
    expect(two).not.toHaveProperty('error');
    expect(two).not.toHaveProperty('fatal');
    expect(two).not.toHaveProperty('trace');

    expect(three).toHaveProperty('severity', 'INFO');
    expect(three).toHaveProperty('level', 30);
    expect(three).toHaveProperty('info', 'info');
    expect(three).toHaveProperty('message', 'info');
    expect(three).not.toHaveProperty('trace');
    expect(three).not.toHaveProperty('debug');
    expect(three).not.toHaveProperty('warn');
    expect(three).not.toHaveProperty('error');
    expect(three).not.toHaveProperty('fatal');

    expect(four).toHaveProperty('severity', 'ERROR');
    expect(four).toHaveProperty('level', 50);
    expect(four).toHaveProperty('error', 'error');
    expect(four).toHaveProperty('message', 'error');
    expect(four).not.toHaveProperty('trace');
    expect(four).not.toHaveProperty('debug');
    expect(four).not.toHaveProperty('info');
    expect(four).not.toHaveProperty('warn');
    expect(four).not.toHaveProperty('fatal');

    expect(five).toHaveProperty('severity', 'ERROR');
    expect(five).toHaveProperty('level', 50);
    expect(five).toHaveProperty('debug', 'debug');
    expect(five).toHaveProperty('error', 'error');
    expect(five).toHaveProperty('message', 'debug');
    expect(five).not.toHaveProperty('trace');
    expect(five).not.toHaveProperty('info');
    expect(five).not.toHaveProperty('warn');
    expect(five).not.toHaveProperty('fatal');

    expect(six).toHaveProperty('severity', 'ERROR');
    expect(six).toHaveProperty('level', 50);
    expect(six).toHaveProperty('warn', 'warn');
    expect(six).toHaveProperty('error', 'error');
    expect(six).toHaveProperty('message', 'warn');
    expect(six).not.toHaveProperty('trace');
    expect(six).not.toHaveProperty('debug');
    expect(six).not.toHaveProperty('info');
    expect(six).not.toHaveProperty('fatal');

    expect(seven).toHaveProperty('severity', 'ERROR');
    expect(seven).toHaveProperty('level', 50);
    expect(seven).toHaveProperty('error', 'error');
    expect(seven).toHaveProperty('message', 'info');
    expect(seven).not.toHaveProperty('trace');
    expect(seven).not.toHaveProperty('debug');
    expect(seven).not.toHaveProperty('info');
    expect(seven).not.toHaveProperty('warn');
    expect(seven).not.toHaveProperty('fatal');

    expect(eight).toHaveProperty('severity', 'ERROR');
    expect(eight).toHaveProperty('level', 50);
    expect(eight).toHaveProperty('debug', 'debug');
    expect(eight).toHaveProperty('error', 'error');
    expect(eight).toHaveProperty('message', 'debug');
    expect(eight).not.toHaveProperty('trace');
    expect(eight).not.toHaveProperty('info');
    expect(eight).not.toHaveProperty('warn');
    expect(eight).not.toHaveProperty('fatal');
});

test('requires data to be passed', async () => {
    expect.assertions(1);

    process.env.LOG_LEVEL = 'info';

    const stream = sink();
    const log = require('../multi')({ stream });

    expect(() => log('message only')).toThrow(
        /You must provide data and message parameters/
    );
});

test('will log even if data is empty', async () => {
    expect.assertions(21);

    process.env.LOG_LEVEL = 'warn';

    const stream = sink();
    const log = require('../multi')({ stream });

    log({ info: { test: true }, warn: {} }, 'object-test');
    log({ info: { test: true }, warn: true }, 'true-test');
    log({ info: { test: true }, warn: null }, 'null-test');
    log({ info: { test: true }, warn: false }, 'false-test');
    log(
        { info: { test: true }, warn: false, error: { errorTest: true } },
        'error-level-test'
    );

    const [objectTest, trueTest, nullTest, falseTest, errorTest] =
        await collect(stream, 'data', 4);

    expect(objectTest).toHaveProperty('severity', 'WARNING');
    expect(objectTest).toHaveProperty('level', 40);
    expect(objectTest).toHaveProperty('message', 'object-test');
    expect(objectTest).not.toHaveProperty('test');

    expect(trueTest).toHaveProperty('severity', 'WARNING');
    expect(trueTest).toHaveProperty('level', 40);
    expect(trueTest).toHaveProperty('message', 'true-test');
    expect(trueTest).not.toHaveProperty('test');

    expect(nullTest).toHaveProperty('severity', 'WARNING');
    expect(nullTest).toHaveProperty('level', 40);
    expect(nullTest).toHaveProperty('message', 'null-test');
    expect(nullTest).not.toHaveProperty('test');

    expect(falseTest).toHaveProperty('severity', 'WARNING');
    expect(falseTest).toHaveProperty('level', 40);
    expect(falseTest).toHaveProperty('message', 'false-test');
    expect(falseTest).not.toHaveProperty('test');

    expect(errorTest).toHaveProperty('severity', 'ERROR');
    expect(errorTest).toHaveProperty('level', 50);
    expect(errorTest).toHaveProperty('message', 'error-level-test');
    expect(errorTest).toHaveProperty('errorTest', true);
    expect(errorTest).not.toHaveProperty('test');
});

test("won't log if log level data not provided", async () => {
    expect.assertions(1);

    process.env.LOG_LEVEL = 'warn';

    const stream = sink();
    const log = require('../multi')({ stream });

    expect(
        log({ debug: { debug: true }, info: { info: true } }, 'warn-test')
    ).toBe(null);
});

test('automatically includes a the source location', async () => {
    expect.assertions(1);

    process.env.LOG_LEVEL = 'info';

    const stream = sink();
    const log = require('../multi')({ stream });

    log({ info: { test: true } }, 'info-test');

    const result = await once(stream, 'data');

    expect(result[sourceLocation]).toEqual({
        file: path.resolve(process.cwd(), __filename),
    });
});

test('can override the source location', async () => {
    expect.assertions(1);

    process.env.LOG_LEVEL = 'info';

    const stream = sink();
    const log = require('../multi')({
        sourceLocation: { file: 'test' },
        stream,
    });

    log({ info: { test: true } }, 'info-test');

    const result = await once(stream, 'data');

    expect(result[sourceLocation]).toEqual({ file: 'test' });
});
