'use strict';

const path = require('path');

const once = (emitter, name) =>
    new Promise((resolve, reject) => {
        if (name !== 'error') {
            emitter.once('error', reject);
        }

        emitter.once(name, (...args) => {
            emitter.removeListener('error', reject);
            resolve(...args);
        });
    });

const collect = (emitter, name, times = 2) =>
    new Promise((resolve, reject) => {
        const collection = [];

        if (name !== 'error') {
            emitter.once('error', reject);
        }

        emitter.on(name, (...args) => {
            collection.push(...args);

            if (collection.length === times) {
                emitter.removeListener('error', reject);
                resolve(collection);
            }
        });
    });

const sink = () => {
    const split = require('split2');

    const result = split((data) => {
        try {
            return JSON.parse(data);
        } catch (err) {
            console.log(err);
            console.log(data);
        }
    });

    return result;
};

const sourceLocation = 'logging.googleapis.com/sourceLocation';
let processEnv = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = Object.assign({}, processEnv);
});

afterEach(() => {
    process.env = processEnv;
});

test('logs to the console', async () => {
    expect.assertions(2);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = require('../')({ stream });

    log.info('test');

    const result = await once(stream, 'data');

    expect(result.level).toBe(30);
    expect(result.msg).toBe('test');
});

test('does not log if "LOG_ENABLED" is set to "false"', async () => {
    expect.assertions(6);

    process.env.LOG_ENABLED = 'false';

    const log = require('../')();

    expect(log.trace.name).toBe('noop');
    expect(log.debug.name).toBe('noop');
    expect(log.info.name).toBe('noop');
    expect(log.warn.name).toBe('noop');
    expect(log.error.name).toBe('noop');
    expect(log.fatal.name).toBe('noop');
});

test('only logs at the specified "LOG_LEVEL" and above', async () => {
    expect.assertions(6);

    process.env.LOG_LEVEL = 'warn';

    const log = require('../')();

    expect(log.trace.name).toBe('noop');
    expect(log.debug.name).toBe('noop');
    expect(log.info.name).toBe('noop');
    expect(log.warn.name).toBe('LOG');
    expect(log.error.name).toBe('LOG');
    expect(log.fatal.name).toBe('');
});

test('includes a severity based on log level', async () => {
    expect.assertions(12);

    process.env.LOG_LEVEL = 'trace';

    const stream = sink();
    const log = require('../')({ stream });

    log.trace('trace-test');
    log.debug('debug-test');
    log.info('info-test');
    log.warn('warn-test');
    log.error('error-test');
    log.fatal('fatal-test');

    const [trace, debug, info, warn, error, fatal] = await collect(
        stream,
        'data',
        6
    );

    expect(trace).toHaveProperty('severity', 'DEBUG');
    expect(trace).toHaveProperty('level', 10);
    expect(debug).toHaveProperty('severity', 'DEBUG');
    expect(debug).toHaveProperty('level', 20);
    expect(info).toHaveProperty('severity', 'INFO');
    expect(info).toHaveProperty('level', 30);
    expect(warn).toHaveProperty('severity', 'WARNING');
    expect(warn).toHaveProperty('level', 40);
    expect(error).toHaveProperty('severity', 'ERROR');
    expect(error).toHaveProperty('level', 50);
    expect(fatal).toHaveProperty('severity', 'CRITICAL');
    expect(fatal).toHaveProperty('level', 60);
});

test('redacts paths specified in "LOG_REDACT_PATHS"', async () => {
    expect.assertions(1);

    process.env.LOG_PRETTY_PRINT = 'false';
    process.env.LOG_REDACT_PATHS = 'redactTest';

    const stream = sink();
    const log = require('../')({ stream });

    log.info({ redactTest: 'this should not appear' }, 'test');

    const result = await once(stream, 'data');

    expect(result.redactTest).toBe('[Redacted]');
});

const log = require('@idearium/log')('packages/log/tests/index.test.js');

test('does not include pid by default', async () => {
    expect.assertions(1);

    const stream = sink();
    const log = require('../')({ stream });

    log.info('test');

    const result = await once(stream, 'data');

    expect(result).not.toHaveProperty('pid');
});

test('includes pid if provided', async () => {
    expect.assertions(1);

    const stream = sink();
    const log = require('../')({ base: { pid: process.pid }, stream });

    log.info('test');

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('pid');
});

test('includes a time formatted to RFC 3339', async () => {
    expect.assertions(2);

    process.env.LOG_LEVEL = 'info';

    const stream = sink();
    const log = require('../')({ stream });

    log.info('info-test');

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('time');
    expect(result.time).toMatch(
        /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/
    );
});

test('automatically includes a the source location', async () => {
    expect.assertions(1);

    process.env.LOG_LEVEL = 'info';

    const stream = sink();
    const log = require('../')({ stream });

    log.info('info-test');

    const result = await once(stream, 'data');

    expect(result[sourceLocation]).toEqual({
        file: path.resolve(process.cwd(), __filename)
    });
});

test('can override the source location', async () => {
    expect.assertions(1);

    process.env.LOG_LEVEL = 'info';

    const stream = sink();
    const log = require('../')({
        sourceLocation: { file: 'test' },
        stream
    });

    log.info('info-test');

    const result = await once(stream, 'data');

    expect(result[sourceLocation]).toEqual({ file: 'test' });
});
