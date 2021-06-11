'use strict';

const express = require('express');
const http = require('http');

const structured = require('../index');
const httpLogger = require('../../log-http');
const errorMiddleware = require('../../log-http/error-middleware');

const middleware = (stream) => httpLogger({ stream });

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

const get = (server, path = '/', headers = {}) =>
    new Promise((resolve) => {
        const { address, port } = server.address();

        return http.get(
            `http://${address}:${port}${path}`,
            { headers },
            (res) => resolve(res)
        );
    });

const post = (server, headers = {}) => {
    const postData = JSON.stringify({ test: true, method: 'POST' });

    return new Promise((resolve) => {
        const { address, port } = server.address();

        const req = http.request(
            `http://${address}:${port}/json`,
            {
                headers: {
                    ...headers,
                    ['content-type']: 'application/json',
                    ['content-length']: Buffer.byteLength(postData)
                },
                method: 'POST'
            },
            (res) => resolve(res)
        );

        req.write(postData);
        req.end();
    });
};

const setup = (middleware) =>
    new Promise((resolve, reject) => {
        const app = express();
        const server = http.createServer(app);

        app.use(middleware);

        app.get('/', (req, res) => res.end('hello world'));

        app.get('/json', (req, res) => {
            res.setHeader('content-type', 'application/json');
            return res.end(JSON.stringify({ test: true }));
        });

        app.get('/error', (req, res, next) =>
            next(new Error('Testing errors...'))
        );

        app.get('/error-with-context', (req, res, next) => {
            const err = new Error('Testing errors...');
            err.context = {
                code: 123
            };
            next(err);
        });

        app.get('/500', (req, res) => {
            res.statusCode = 500;
            return res.end('error');
        });

        app.use(errorMiddleware());

        server.listen(0, '127.0.0.1', (err) => {
            if (err) {
                return reject(err);
            }

            return resolve(server);
        });
    });

test('logs strings without mutation', (done) => {
    expect.assertions(1);

    const stream = structured();

    once(stream, 'data').then((line) => {
        expect(line).toBe('test');

        return done();
    });

    stream.write('test');
});

test('logs non-http json without mutation', (done) => {
    expect.assertions(1);

    const jsonString =
        '{"level":30,"severity":"INFO","time":"2021-06-07T02:26:30.316Z","logging.googleapis.com/sourceLocation":{"file":"/app/tests/index.test.js"},"message":"test"}';
    const stream = structured();

    once(stream, 'data').then((line) => {
        expect(line).toEqual(jsonString);

        return done();
    });

    stream.write(jsonString);
});

test('logs req when logging http requests', async (done) => {
    expect.assertions(1);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('req');

        return done();
    });

    get(server);
});

test('logs res when logging http requests', async (done) => {
    expect.assertions(1);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('res');

        return done();
    });

    get(server);
});

test('does not include error information when an error did not occur', async (done) => {
    expect.assertions(1);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).not.toHaveProperty('@type');

        return done();
    });

    get(server);
});

test('logs err when an error occurs during http request/response lifecycle', async (done) => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('@type');
        expect(line['@type']).toEqual(
            'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent'
        );

        return done();
    });

    get(server, '/error');
});

test('uses structured logging format when logging http requests', async (done) => {
    expect.assertions(7);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('httpRequest');
        expect(line).toHaveProperty('message');
        expect(line).toHaveProperty('req');
        expect(line).toHaveProperty('res');
        expect(line).toHaveProperty('severity');
        expect(line).toHaveProperty('severity');
        expect(line).toHaveProperty('time');

        return done();
    });

    get(server);
});

test('http requests includes requestMethod', async (done) => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('httpRequest');
        expect(line.httpRequest).toHaveProperty('requestMethod');

        return done();
    });

    get(server);
});

test('http requests includes requestUrl', async (done) => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('httpRequest');
        expect(line.httpRequest).toHaveProperty('requestUrl');

        return done();
    });

    get(server);
});

test('http requests includes requestSize', async (done) => {
    expect.assertions(3);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('httpRequest');
        expect(line.httpRequest).toHaveProperty('requestSize');
        expect(line.httpRequest.requestSize).toBe('29');

        return done();
    });

    post(server);
});

test('http requests includes responseSize', async (done) => {
    expect.assertions(3);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('httpRequest');
        expect(line.httpRequest).toHaveProperty('responseSize');
        expect(line.httpRequest.responseSize).toBe(11);

        return done();
    });

    get(server);
});

test('http requests includes protocol', async (done) => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('httpRequest');
        expect(line.httpRequest).toHaveProperty('protocol');

        return done();
    });

    get(server);
});

test('http requests includes status', async (done) => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('httpRequest');
        expect(line.httpRequest).toHaveProperty('status');

        return done();
    });

    get(server);
});

test('http requests includes userAgent', async (done) => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('httpRequest');
        expect(line.httpRequest).toHaveProperty('userAgent');

        return done();
    });

    get(server);
});

test('http requests includes remoteIp', async (done) => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('httpRequest');
        expect(line.httpRequest).toHaveProperty('remoteIp');

        return done();
    });

    get(server);
});

test('http requests includes remoteIp and prefers x-forwarded-for header', async (done) => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('httpRequest');
        expect(line.httpRequest).toHaveProperty('remoteIp');

        return done();
    });

    get(server, '/', { 'x-forwarded-for': '10.0.0.12' });
});

test('http requests includes referer', async (done) => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('httpRequest');
        expect(line.httpRequest).toHaveProperty('referer');

        return done();
    });

    get(server);
});

test('uses structured error logging when an error occurs during http request/response lifecycle', async (done) => {
    expect.assertions(10);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        const line = JSON.parse(result.toString());

        expect(line).toHaveProperty('@type');
        expect(line['@type']).toEqual(
            'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent'
        );
        expect(line).toHaveProperty('message');
        expect(line.message).toBe('request errored');
        expect(line).not.toHaveProperty('httpRequest');
        expect(line).not.toHaveProperty('err');
        expect(line).toHaveProperty('context');
        expect(line.context).toHaveProperty('httpRequest');
        expect(line).toHaveProperty('exception');
        expect(line.exception).toContain('Testing errors...');

        return done();
    });

    get(server, '/error');
});
