'use strict';

const path = require('path');
const { collect, once, sink } = require('./lib');

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

    const stream = sink();
    const log = require('../')({ stream });

    log.info('test');

    const result = await once(stream, 'data');

    expect(result.level).toBe(30);
    expect(result.message).toBe('test');
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

    process.env.LOG_REDACT_PATHS = 'redactTest';

    const stream = sink();
    const log = require('../')({ stream });

    log.info({ redactTest: 'this should not appear' }, 'test');

    const result = await once(stream, 'data');

    expect(result.redactTest).toBe('[Redacted]');
});

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
        file: path.resolve(process.cwd(), __filename),
    });
});

test('can override the source location', async () => {
    expect.assertions(1);

    process.env.LOG_LEVEL = 'info';

    const stream = sink();
    const log = require('../')({
        sourceLocation: { file: 'test' },
        stream,
    });

    log.info('info-test');

    const result = await once(stream, 'data');

    expect(result[sourceLocation]).toEqual({ file: 'test' });
});

test('will rename opentelemetry snake_case to camelCase', async () => {
    expect.assertions(9);

    process.env.LOG_LEVEL = 'info';

    const stream = sink();
    const log = require('../')({
        sourceLocation: { file: 'test' },
        stream,
    });

    log.info(
        { span_id: 'XYZ', trace_flags: '01', trace_id: 'ABC123' },
        'trace-id-test'
    );

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('spanId');
    expect(result).not.toHaveProperty('span_id');
    expect(result.spanId).toEqual('XYZ');
    expect(result).toHaveProperty('traceId');
    expect(result).not.toHaveProperty('trace_id');
    expect(result.traceId).toEqual('ABC123');
    expect(result).toHaveProperty('traceFlags');
    expect(result).not.toHaveProperty('trace_flags');
    expect(result.traceFlags).toEqual('01');
});
