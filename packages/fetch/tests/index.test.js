'use strict';

const express = require('express');
const { Readable } = require('stream');

const fetchApi = require('../');

const testBaseUrl = 'http://localhost:8888';
const headers = { 'content-type': 'application/json' };

let app;
let server;

beforeAll((done) => {
    app = express();

    server = app.listen(8888, () => done());
});

afterEach(() => {
    jest.restoreAllMocks();
});

afterAll((done) => {
    server.close(() => done());
});

function generateResponse(req, res, { body, status = 200, type } = {}) {
    res.status(status);

    if (type) {
        res.type(type);
    }

    if (req.query.stream !== 'true') {
        return res.send(body);
    }

    const stream = new Readable({
        read() {
            if (body) {
                this.push(JSON.stringify(body));
            }
            this.push(null);
        },
    });

    stream.pipe(res);
}

it('is a function', () => {
    expect(typeof fetchApi).toBe('function');
});

it('returns a tuple for successful requests', async () => {
    expect.assertions(2);

    const testPath = '/tuple-success';

    app.get(testPath, (req, res) => {
        generateResponse(req, res, {
            body: { pass: true },
            type: 'application/json',
        });
    });

    await expect(fetchApi(`${testBaseUrl}${testPath}`)).resolves.toMatchObject({
        ok: true,
        result: { pass: true },
        status: 200,
    });
    await expect(
        fetchApi(`${testBaseUrl}${testPath}?stream=true`),
    ).resolves.toMatchObject({
        ok: true,
        result: { pass: true },
        status: 200,
    });
});

it('returns a tuple for error requests', async () => {
    expect.assertions(2);

    const testPath = '/tuple-failed';

    app.get(testPath, (req, res) => {
        generateResponse(req, res, {
            body: { pass: false },
            status: 400,
            type: 'application/json',
        });
    });

    await expect(fetchApi(`${testBaseUrl}${testPath}`)).resolves.toMatchObject({
        ok: false,
        result: { pass: false },
        status: 400,
    });
    await expect(
        fetchApi(`${testBaseUrl}${testPath}?stream=true`),
    ).resolves.toMatchObject({
        ok: false,
        result: { pass: false },
        status: 400,
    });
});

it('result contains the main response properties', async () => {
    expect.assertions(12);

    const testPath = '/main-response-properties';

    app.get(testPath, (req, res) => {
        generateResponse(req, res, { type: 'application/json' });
    });

    const response = await fetchApi(`${testBaseUrl}${testPath}`);

    // https://developer.mozilla.org/en-US/docs/Web/API/Response#properties
    expect(response).toHaveProperty('headers');
    expect(response).toHaveProperty('ok');
    expect(response).toHaveProperty('redirected');
    expect(response).toHaveProperty('status');
    expect(response).toHaveProperty('statusText');
    expect(response).toHaveProperty('url');

    const streamResponse = await fetchApi(
        `${testBaseUrl}${testPath}?stream=true`,
    );

    // https://developer.mozilla.org/en-US/docs/Web/API/Response#properties
    expect(streamResponse).toHaveProperty('headers');
    expect(streamResponse).toHaveProperty('ok');
    expect(streamResponse).toHaveProperty('redirected');
    expect(streamResponse).toHaveProperty('status');
    expect(streamResponse).toHaveProperty('statusText');
    expect(streamResponse).toHaveProperty('url');
});

it('automatically sets the content-type header', async () => {
    expect.assertions(2);

    const fetchSpy = jest.spyOn(global, 'fetch');
    const testPath = '/automatic-content-type-header';
    const testUrl = `${testBaseUrl}${testPath}`;

    app.get(testPath, (req, res) => {
        generateResponse(req, res, {});
    });

    await fetchApi(testUrl);

    expect(fetchSpy).toHaveBeenCalledWith(testUrl, {
        headers,
    });

    jest.restoreAllMocks();

    await fetchApi(`${testUrl}?stream=true`);

    expect(fetchSpy).toHaveBeenCalledWith(testUrl, {
        headers,
    });
});

it('allows POST requests', async () => {
    expect.assertions(2);

    const fetchSpy = jest.spyOn(global, 'fetch');
    const testPath = '/post-requests';
    const testUrl = `${testBaseUrl}${testPath}`;

    app.post(testPath, (req, res) => {
        generateResponse(req, res, {});
    });

    await fetchApi(testUrl, { method: 'POST' });

    expect(fetchSpy).toHaveBeenCalledWith(testUrl, {
        headers,
        method: 'POST',
    });

    jest.restoreAllMocks();

    await fetchApi(`${testUrl}?stream=true`, { method: 'POST' });

    expect(fetchSpy).toHaveBeenCalledWith(testUrl, {
        headers,
        method: 'POST',
    });
});

it('allows fetch parameters', async () => {
    expect.assertions(2);

    const fetchSpy = jest.spyOn(global, 'fetch');
    const testPath = '/fetch-parameters';
    const testUrl = `${testBaseUrl}${testPath}`;
    const credentials = 'same-origin';

    app.get(testPath, (req, res) => {
        generateResponse(req, res, {});
    });

    await fetchApi(testUrl, { credentials });

    expect(fetchSpy).toHaveBeenCalledWith(testUrl, {
        credentials,
        headers,
    });

    jest.restoreAllMocks();

    await fetchApi(`${testUrl}?stream=true`, { credentials });

    expect(fetchSpy).toHaveBeenCalledWith(testUrl, {
        credentials,
        headers,
    });
});

it('allows multiple fetch parameters', async () => {
    expect.assertions(2);

    const fetchSpy = jest.spyOn(global, 'fetch');
    const testPath = '/multiple-fetch-parameters';
    const testUrl = `${testBaseUrl}${testPath}`;
    const cache = 'no-store';
    const credentials = 'same-origin';
    const opts = {
        cache,
        credentials,
        headers,
    };

    app.get(testPath, (req, res) => {
        generateResponse(req, res, {});
    });

    await fetchApi(testUrl, { cache, credentials });

    expect(fetchSpy).toHaveBeenCalledWith(testUrl, opts);

    jest.restoreAllMocks();

    await fetchApi(`${testUrl}?stream=true`, { cache, credentials });

    expect(fetchSpy).toHaveBeenCalledWith(testUrl, opts);
});

it('does not fail if no content header is returned', async () => {
    expect.assertions(2);

    const testPath = '/no-content-header';

    app.get(testPath, (req, res) => {
        generateResponse(req, res, { status: 400 });
    });

    await expect(fetchApi(`${testBaseUrl}${testPath}`)).resolves.toMatchObject({
        ok: false,
        result: {},
        status: 400,
    });

    await expect(
        fetchApi(`${testBaseUrl}${testPath}?stream=true`),
    ).resolves.toMatchObject({
        ok: false,
        result: {},
        status: 400,
    });
});

it('does not duplicate the content type header', async () => {
    expect.assertions(4);

    const fetchSpy = jest.spyOn(global, 'fetch');
    const testPath = '/no-duplicate-content-header';
    const testUrl = `${testBaseUrl}${testPath}`;

    app.get(testPath, (req, res) => {
        generateResponse(req, res, {});
    });

    await fetchApi(testUrl, {
        headers: { 'Content-Type': 'application/json' },
    });

    await expect(fetchSpy).toHaveBeenCalledWith(testUrl, {
        headers: { 'content-type': 'application/json' },
    });

    await expect(fetchSpy).not.toHaveBeenCalledWith(testUrl, {
        headers: { 'Content-Type': 'application/json' },
    });

    jest.restoreAllMocks();

    await fetchApi(`${testUrl}?stream=true`, {
        headers: { 'Content-Type': 'application/json' },
    });

    await expect(fetchSpy).toHaveBeenCalledWith(testUrl, {
        headers: { 'content-type': 'application/json' },
    });

    await expect(fetchSpy).not.toHaveBeenCalledWith(testUrl, {
        headers: { 'Content-Type': 'application/json' },
    });
});
