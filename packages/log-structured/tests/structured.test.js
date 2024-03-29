'use strict';

const express = require('express');
const http = require('http');

const structured = require('../index');
const requestLogger = require('../../log-http');
const errorLogger = require('../../log-http/middleware/log-error');
const errorHandler = require('../../log-http/middleware/server-error');
const notFound = require('../../log-http/middleware/not-found');

const middleware = (stream) =>
    requestLogger({
        stream,
    });

const tracedMiddleware = (stream) =>
    requestLogger({
        stream,
        customProps: () => ({ spanId: 'XYZ', traceId: 'ABC123' }),
    });

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
                    'content-type': 'application/json',
                    'content-length': Buffer.byteLength(postData),
                },
                method: 'POST',
            },
            (res) => resolve(res)
        );

        req.write(postData);
        req.end();
    });
};

const setup = (serverMiddleware) =>
    new Promise((resolve, reject) => {
        const app = express();
        const server = http.createServer(app);

        app.use(serverMiddleware);

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
                code: 123,
            };
            next(err);
        });

        app.get('/500', (req, res) => {
            res.statusCode = 500;
            return res.end('error');
        });

        app.use(notFound());
        app.use(errorLogger());
        app.use(errorHandler());

        server.listen(0, '127.0.0.1', (err) => {
            if (err) {
                return reject(err);
            }

            return resolve(server);
        });
    });

test('logs strings without mutation', async () => {
    expect.assertions(1);

    const stream = structured();

    stream.write('test');

    const line = await once(stream, 'data');

    expect(line).toBe('test');
});

test('logs non-http json without mutation', async () => {
    expect.assertions(1);

    const jsonString =
        '{"level":30,"severity":"INFO","time":"2021-06-07T02:26:30.316Z","logging.googleapis.com/sourceLocation":{"file":"/app/tests/index.test.js"},"message":"test"}';
    const stream = structured();

    stream.write(jsonString);

    const line = await once(stream, 'data');

    expect(line).toMatch(jsonString);
});

test('logs req when logging http requests', async () => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('req');
    expect(line.req).toHaveProperty('headers');

    server.close();
});

test('logs req even without headers', async () => {
    expect.assertions(2);

    const stream = structured();

    stream.write(
        '{"level":30,"severity":"INFO","time":"2021-11-25T02:51:57.024Z","req":{"id":1,"method":"GET","protocol":"http/1.1","remoteAddress":"127.0.0.1","remoteIp":"127.0.0.1","remotePort":65404,"url":"/"},"spanId":"XYZ","traceId":"ABC123","res":{"headers":{"x-powered-by":"Express"},"size":11,"statusCode":200},"responseTime":0.001,"message":"request completed"}'
    );

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('req');
    expect(line.req).not.toHaveProperty('headers');
});

test('logs res when logging http requests', async () => {
    expect.assertions(1);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('res');

    server.close();
});

test('does not include error information when an error did not occur', async () => {
    expect.assertions(1);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).not.toHaveProperty('@type');

    server.close();
});

test('logs err when an error occurs during http request/response lifecycle', async () => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server, '/error');

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('@type');
    expect(line['@type']).toEqual(
        'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent'
    );

    server.close();
});

test('uses structured logging format when logging http requests', async () => {
    expect.assertions(7);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('httpRequest');
    expect(line).toHaveProperty('message');
    expect(line).toHaveProperty('req');
    expect(line).toHaveProperty('res');
    expect(line).toHaveProperty('severity');
    expect(line).toHaveProperty('severity');
    expect(line).toHaveProperty('time');

    server.close();
});

test('http requests includes requestMethod', async () => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('httpRequest');
    expect(line.httpRequest).toHaveProperty('requestMethod');

    server.close();
});

test('http requests includes requestUrl', async () => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('httpRequest');
    expect(line.httpRequest).toHaveProperty('requestUrl');

    server.close();
});

test('http requests includes requestSize', async () => {
    expect.assertions(3);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    post(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('httpRequest');
    expect(line.httpRequest).toHaveProperty('requestSize');
    expect(line.httpRequest.requestSize).toBe('29');

    server.close();
});

test('http requests includes responseSize', async () => {
    expect.assertions(3);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('httpRequest');
    expect(line.httpRequest).toHaveProperty('responseSize');
    expect(line.httpRequest.responseSize).toBe(11);

    server.close();
});

test('http requests includes protocol', async () => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('httpRequest');
    expect(line.httpRequest).toHaveProperty('protocol');

    server.close();
});

test('http requests includes status', async () => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('httpRequest');
    expect(line.httpRequest).toHaveProperty('status');

    server.close();
});

test('http requests includes userAgent', async () => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('httpRequest');
    expect(line.httpRequest).toHaveProperty('userAgent');

    server.close();
});

test('http requests includes remoteIp', async () => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('httpRequest');
    expect(line.httpRequest).toHaveProperty('remoteIp');

    server.close();
});

test('http requests includes remoteIp and prefers x-forwarded-for header', async () => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server, '/', { 'x-forwarded-for': '10.0.0.12' });

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('httpRequest');
    expect(line.httpRequest).toHaveProperty('remoteIp');

    server.close();
});

test('http requests includes referer', async () => {
    expect.assertions(2);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server);

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('httpRequest');
    expect(line.httpRequest).toHaveProperty('referer');

    server.close();
});

test('uses structured error logging when an error occurs during http request/response lifecycle', async () => {
    expect.assertions(10);

    const stream = structured();
    const log = middleware(stream);
    const server = await setup(log);

    get(server, '/error');

    const result = await once(stream, 'data');
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

    server.close();
});

test('non-http requests that include traceId information is transformed to structured logging format', async () => {
    expect.assertions(1);

    const jsonString =
        '{"level":30,"severity":"INFO","time":"2021-06-07T02:26:30.316Z","logging.googleapis.com/sourceLocation":{"file":"/app/tests/index.test.js"},"message":"test","traceId":"ABC123"}';
    const stream = structured();

    stream.write(jsonString);

    const line = await once(stream, 'data');

    expect(line).toMatch(
        '{"level":30,"severity":"INFO","time":"2021-06-07T02:26:30.316Z","logging.googleapis.com/sourceLocation":{"file":"/app/tests/index.test.js"},"message":"test","traceId":"ABC123","trace":"projects/TEST_PROJECT/traces/ABC123"}'
    );
});

test('http requests that include traceId information is transformed to structured logging format', async () => {
    expect.assertions(2);

    const stream = structured();
    const log = tracedMiddleware(stream);
    const server = await setup(log);

    get(server, '/');

    const result = await once(stream, 'data');
    const line = JSON.parse(result.toString());

    expect(line).toHaveProperty('trace');
    expect(line.trace).toBe('projects/TEST_PROJECT/traces/ABC123');

    server.close();
});
