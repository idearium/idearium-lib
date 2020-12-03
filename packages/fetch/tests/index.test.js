'use strict';

jest.mock('isomorphic-fetch', () => require('fetch-mock-jest').sandbox());

const fetchMock = require('isomorphic-fetch');
const fetchApi = require('../');

const testUrl = 'http://www.idearium.io/';

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
