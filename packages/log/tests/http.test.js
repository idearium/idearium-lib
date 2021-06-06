'use strict';

const http = require('http');

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

const setup = (logger) =>
    new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            logger(req, res);

            if (req.url === '/') {
                return res.end('hello world');
            }

            if (req.url === '/error') {
                res.statusCode = 500;
                return res.end('error');
            }

            res.statusCode = 404;
            return res.end('Not found');
        });

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

test('logs to the console', async (done) => {
    expect.assertions(2);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = require('../http')({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result.level).toBe(30);
        expect(result.message).toBe('request completed');

        return done();
    });

    get(server);
});

test('logs using structured logging format', async (done) => {
    expect.assertions(5);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = require('../http')({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result).toHaveProperty('severity');
        expect(result).toHaveProperty('message');
        expect(result).toHaveProperty('httpRequest');
        expect(result).toHaveProperty('time');
        expect(result).toHaveProperty('severity');

        return done();
    });

    get(server);
});

test('logs structured httpRequest', async (done) => {
    expect.assertions(10);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = require('../http')({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result).toHaveProperty('httpRequest');
        expect(result.httpRequest).toHaveProperty('requestMethod');
        expect(result.httpRequest).toHaveProperty('requestUrl');
        expect(result.httpRequest).toHaveProperty('requestSize');
        expect(result.httpRequest).toHaveProperty('status');
        expect(result.httpRequest).toHaveProperty('responseSize');
        expect(result.httpRequest).toHaveProperty('userAgent');
        expect(result.httpRequest).toHaveProperty('remoteIp');
        expect(result.httpRequest).toHaveProperty('referer');
        expect(result.httpRequest).toHaveProperty('protocol');

        return done();
    });

    get(server);
});

test('logs 404 status', async (done) => {
    expect.assertions(2);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = require('../http')({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result.httpRequest).toHaveProperty('status');
        expect(result.httpRequest.status).toBe(404);

        return done();
    });

    get(server, '/missing');
});

test('logs the user-agent', async (done) => {
    expect.assertions(2);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = require('../http')({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result.httpRequest).toHaveProperty('userAgent');
        expect(result.httpRequest.userAgent).toBe('http-test');

        return done();
    });

    get(server, '/', { 'user-agent': 'http-test' });
});

test('uses x-forwarded-for if present', async (done) => {
    expect.assertions(2);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = require('../http')({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result.httpRequest).toHaveProperty('remoteIp');
        expect(result.httpRequest.remoteIp).toBe('10.0.0.12');

        return done();
    });

    get(server, '/', { 'x-forwarded-for': '10.0.0.12' });
});
