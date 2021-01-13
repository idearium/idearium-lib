'use strict';

jest.mock('isomorphic-fetch', () => require('fetch-mock-jest').sandbox());

const fetchMock = require('isomorphic-fetch');
const fetchApi = require('../');

const testUrl = 'http://www.idearium.io/';
const headers = { 'content-type': 'application/json' };

beforeEach(() => {
    fetchMock.mockClear();
    fetchMock.mockReset();
});

it('is a function', () => {
    expect(typeof fetchApi).toBe('function');
});

it('returns a tuple for successful requests', async () => {
    expect.assertions(1);

    fetchMock.get(testUrl, { pass: true });

    await expect(fetchApi(testUrl)).resolves.toEqual({
        ok: true,
        result: { pass: true },
        status: 200
    });
});

it('returns a tuple for error requests', async () => {
    expect.assertions(1);

    fetchMock.get(testUrl, 400);

    await expect(fetchApi(testUrl)).rejects.toEqual(new Error('Bad Request'));
});

it('automatically sets the content-type header', async () => {
    expect.assertions(1);

    const headers = { 'content-type': 'application/json' };

    fetchMock.mock(testUrl, [], {
        headers
    });

    await fetchApi(testUrl);

    await expect(fetchMock).toHaveBeenCalledWith(testUrl, {
        headers
    });
});

it('allows POST requests', async () => {
    expect.assertions(1);

    fetchMock.mock(testUrl, [], {
        headers,
        method: 'POST'
    });

    await fetchApi(testUrl, { method: 'POST' });

    await expect(fetchMock).toHaveBeenCalledWith(testUrl, {
        headers,
        method: 'POST'
    });
});

it('allows fetch parameters', async () => {
    expect.assertions(1);

    const credentials = 'same-origin';

    fetchMock.mock(testUrl, [], {
        credentials,
        headers
    });

    await fetchApi(testUrl, { credentials });

    expect(fetchMock).toHaveBeenCalledWith(testUrl, {
        credentials,
        headers
    });
});

it('allows multiple fetch parameters', async () => {
    expect.assertions(1);

    const cache = 'no-store';
    const credentials = 'same-origin';
    const opts = {
        cache,
        credentials,
        headers
    };

    fetchMock.mock(testUrl, [], opts);

    await fetchApi(testUrl, { cache, credentials });

    expect(fetchMock).toHaveBeenCalledWith(testUrl, opts);
});
