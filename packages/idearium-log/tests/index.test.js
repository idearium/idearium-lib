'use strict';

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

let processEnv = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = { ...processEnv };
});

afterEach(() => {
    process.env = processEnv;
});

test('logs to the console', async () => {
    expect.assertions(2);

    process.env.PINO_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = require('../').init({ stream });

    log.info('test');

    const result = await once(stream, 'data');

    expect(result.level).toBe(30);
    expect(result.msg).toBe('test');
});

test('does not log if "LOG_ENABLED" is set to "false"', async () => {
    expect.assertions(6);

    process.env.LOG_ENABLED = 'false';

    const log = require('../');

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

    const log = require('../');

    expect(log.trace.name).toBe('noop');
    expect(log.debug.name).toBe('noop');
    expect(log.info.name).toBe('noop');
    expect(log.warn.name).toBe('LOG');
    expect(log.error.name).toBe('LOG');
    expect(log.fatal.name).toBe('LOG');
});

test('redacts paths specified in "PINO_REDACT_PATHS"', async () => {
    expect.assertions(1);

    process.env.PINO_PRETTY_PRINT = 'false';
    process.env.PINO_REDACT_PATHS = 'redacttest';

    const stream = sink();
    const log = require('../').init({ stream });

    log.info({ redacttest: 'this should not appear' }, 'test');

    const result = await once(stream, 'data');

    expect(result.redacttest).toBe('[Redacted]');
});

test('logs to a remote server if "LOG_REMOTE" is "true"', async () => {
    expect.assertions(1);

    process.env.LOG_REMOTE = 'true';

    const stream = sink();
    const log = require('../').init({ stream });

    log.info('test');

    const result = await once(stream, 'data');

    // If this isn't working, sink would throw an error due to JSON.parse trying to parse the prettyfied log.
    expect(result.msg).toBe('test');
});
