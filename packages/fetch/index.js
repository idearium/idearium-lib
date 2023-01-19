'use strict';

const fetch = require('isomorphic-fetch');

const parseBody = (response) => {
    if (
        response.headers &&
        response.headers.get('Content-Type') &&
        response.headers.get('Content-Type').includes('application/json')
    ) {
        return response.json();
    }

    return response.text();
};

const parseResponse = async (response) => {
    response.result = await parseBody(response);

    return response;
};

const fetchApi = async (url, opts = {}) => {
    const headers = {};

    if (opts?.headers) {
        Object.keys(opts.headers).forEach(
            (key) => (headers[key.toLowerCase()] = opts.headers[key])
        );
    }

    if (!headers['content-type']) {
        headers['content-type'] = 'application/json';
    }

    opts.headers = headers;

    return parseResponse(await fetch(url, opts));
};

module.exports = fetchApi;
