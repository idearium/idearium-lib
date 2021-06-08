'use strict';

const http = require('http');
const logger = require('../');

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
        const server = http.createServer((req, res) => {
            middleware(req, res);

            if (req.url === '/') {
                return res.end('hello world');
            }

            if (req.url === '/json') {
                res.setHeader('content-type', 'application/json');
                return res.end(JSON.stringify({ test: true }));
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
    const log = logger({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result.level).toBe(30);
        expect(result.message).toBe('request completed');

        return done();
    });

    get(server);
});

test('logs 200 status', async (done) => {
    expect.assertions(3);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = logger({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result).toHaveProperty('res');
        expect(result.res).toHaveProperty('statusCode');
        expect(result.res.statusCode).toBe(200);

        return done();
    });

    get(server);
});

test('logs 404 status', async (done) => {
    expect.assertions(3);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = logger({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result).toHaveProperty('res');
        expect(result.res).toHaveProperty('statusCode');
        expect(result.res.statusCode).toBe(404);

        return done();
    });

    get(server, '/missing');
});

test('logs 500 status', async (done) => {
    expect.assertions(3);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = logger({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result).toHaveProperty('res');
        expect(result.res).toHaveProperty('statusCode');
        expect(result.res.statusCode).toBe(500);

        return done();
    });

    get(server, '/error');
});

test('logs the response content-type', async (done) => {
    expect.assertions(4);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = logger({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result).toHaveProperty('res');
        expect(result.res).toHaveProperty('headers');
        expect(Object.keys(result.res.headers)).toContain('content-type');
        expect(result.res.headers['content-type']).toContain(
            'application/json'
        );

        return done();
    });

    get(server, '/json');
});

test('logs the response size', async (done) => {
    expect.assertions(3);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = logger({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result).toHaveProperty('res');
        expect(result.res).toHaveProperty('size');
        expect(result.res.size).toBe(13);

        return done();
    });

    get(server, '/json');
});

test('logs the protocol', async (done) => {
    expect.assertions(3);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = logger({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result).toHaveProperty('req');
        expect(result.req).toHaveProperty('protocol');
        expect(result.req.protocol).toBe('http/1.1');

        return done();
    });

    get(server);
});

test('uses x-forwarded-for if present', async (done) => {
    expect.assertions(3);

    process.env.LOG_PRETTY_PRINT = 'false';

    const stream = sink();
    const log = logger({ stream });
    const server = await setup(log);

    once(stream, 'data').then((result) => {
        expect(result).toHaveProperty('req');
        expect(result.req).toHaveProperty('remoteIp');
        expect(result.req.remoteIp).toBe('10.0.0.12');

        return done();
    });

    get(server, '/', { 'x-forwarded-for': '10.0.0.12' });
});
