'use strict';

const http = require('http');
const express = require('express');
const requestLogger = require('../');
const errorLogger = require('../middleware/log-error');
const notFound = require('../middleware/not-found');
const serverError = require('../middleware/server-error');

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

const get = (server, path = '/', headers = {}) =>
    new Promise((resolve) => {
        const { address, port } = server.address();

        return http.get(
            `http://${address}:${port}${path}`,
            { headers },
            (res) => resolve(res)
        );
    });

const setup = (middleware) =>
    new Promise((resolve, reject) => {
        const app = express();
        const server = http.createServer(app);

        app.use(middleware);

        app.get('/', (req, res) => res.send('hello world'));

        app.get('/json', (req, res) => res.json({ test: true }));

        app.get('/error', (req, res, next) =>
            next(new Error('Testing errors...'))
        );

        app.get('/error-with-context', (req, res, next) => {
            const err = new Error('Testing errors...');
            err.context = {
                code: 123,
            };
            next(err);
        });

        app.get('/500', (req, res) => {
            res.statusCode = 500;
            return res.send('error');
        });

        app.use(notFound());
        app.use(errorLogger());
        app.use(serverError());

        server.listen(0, '127.0.0.1', (err) => {
            if (err) {
                return reject(err);
            }

            return resolve(server);
        });
    });

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
    const log = requestLogger({ stream });
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');

    expect(result.level).toBe(30);
    expect(result.message).toBe('request completed');

    server.close();
});

test('logs 200 status', async () => {
    expect.assertions(3);

    const stream = sink();
    const log = requestLogger({ stream });
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('res');
    expect(result.res).toHaveProperty('statusCode');
    expect(result.res.statusCode).toBe(200);

    server.close();
});

test('logs 404 status', async () => {
    expect.assertions(3);

    const stream = sink();
    const log = requestLogger({ stream });
    const server = await setup(log);

    get(server, '/missing');

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('res');
    expect(result.res).toHaveProperty('statusCode');
    expect(result.res.statusCode).toBe(404);

    server.close();
});

test('logs 500 status', async () => {
    expect.assertions(3);

    const stream = sink();
    const log = requestLogger({ stream });
    const server = await setup(log);

    get(server, '/500');

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('res');
    expect(result.res).toHaveProperty('statusCode');
    expect(result.res.statusCode).toBe(500);

    server.close();
});

test('logs errors', async () => {
    expect.assertions(10);

    const stream = sink();
    const log = requestLogger({ stream });
    const server = await setup(log);

    get(server, '/error');

    const result = await once(stream, 'data');

    expect(result.severity).toBe('ERROR');
    expect(result).toHaveProperty('res');
    expect(result.res).toHaveProperty('statusCode');
    expect(result.res.statusCode).toBe(500);
    expect(result).toHaveProperty('err');
    expect(result.err).toHaveProperty('message');
    expect(result.err.message).toContain('Testing errors...');
    expect(result.err).toHaveProperty('@type');
    expect(result.err['@type']).toBe(
        'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent'
    );
    expect(result.err).not.toHaveProperty('context');

    server.close();
});

test('logs error context', async () => {
    expect.assertions(10);

    const stream = sink();
    const log = requestLogger({ stream });
    const server = await setup(log);

    get(server, '/error-with-context');

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('res');
    expect(result.res).toHaveProperty('statusCode');
    expect(result.res.statusCode).toBe(500);
    expect(result).toHaveProperty('err');
    expect(result.err).toHaveProperty('message');
    expect(result.err.message).toContain('Testing errors...');
    expect(result.err).toHaveProperty('@type');
    expect(result.err['@type']).toBe(
        'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent'
    );
    expect(result.err).toHaveProperty('context');
    expect(result.err.context).toEqual({ code: 123 });

    server.close();
});

test('logs the response content-type', async () => {
    expect.assertions(4);

    const stream = sink();
    const log = requestLogger({ stream });
    const server = await setup(log);

    get(server, '/json');

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('res');
    expect(result.res).toHaveProperty('headers');
    expect(Object.keys(result.res.headers)).toContain('content-type');
    expect(result.res.headers['content-type']).toContain('application/json');

    server.close();
});

test('logs the response size', async () => {
    expect.assertions(3);

    const stream = sink();
    const log = requestLogger({ stream });
    const server = await setup(log);

    get(server, '/json');

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('res');
    expect(result.res).toHaveProperty('size');
    expect(String(result.res.size)).toBe('13');

    server.close();
});

test('logs the response time', async () => {
    expect.assertions(1);

    const stream = sink();
    const log = requestLogger({ stream });
    const server = await setup(log);

    get(server, '/json');

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('responseTime');

    server.close();
});

test('logs the protocol', async () => {
    expect.assertions(3);

    const stream = sink();
    const log = requestLogger({ stream });
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('req');
    expect(result.req).toHaveProperty('protocol');
    expect(result.req.protocol).toBe('http/1.1');

    server.close();
});

test('uses x-forwarded-for if present', async () => {
    expect.assertions(3);

    const stream = sink();
    const log = requestLogger({ stream });
    const server = await setup(log);

    get(server, '/', { 'x-forwarded-for': '10.0.0.12' });

    const result = await once(stream, 'data');

    expect(result).toHaveProperty('req');
    expect(result.req).toHaveProperty('remoteIp');
    expect(result.req.remoteIp).toBe('10.0.0.12');

    server.close();
});
