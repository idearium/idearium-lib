/* eslint-disable no-process-env,global-require */
'use strict';

const processEnv = process.env;

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

beforeEach(() => {
    jest.resetModules();
    process.env = Object.assign({}, processEnv);
});

afterEach(() => {
    process.env = processEnv;
});

test('throws if INSIGHT_OPS_REGION is not set', () => {
    expect(() => require('../bin/insightops')).toThrow('A region is required');
});

test('throws if INSIGHT_OPS_TOKEN is not set', () => {
    process.env.INSIGHT_OPS_REGION = 'eu';

    expect(() => require('../bin/insightops')).toThrow('A token is required');
});

test('is okay if all environment variables are set', () => {
    process.env.INSIGHT_OPS_REGION = 'eu';
    process.env.INSIGHT_OPS_TOKEN = '123';

    expect(() => require('../bin/insightops')).not.toThrow(
        'A token is required'
    );
});

test('logs to a remote server', async () => {
    expect.assertions(1);

    const stream = sink();
    const log = require('../../log')({ stream });

    log.info('test');

    const result = await once(stream, 'data');

    // If this isn't working, sink would throw an error due to JSON.parse trying to parse the prettyfied log.
    expect(result.message).toBe('test');
});
/* eslint-enable no-process-env,global-require */
