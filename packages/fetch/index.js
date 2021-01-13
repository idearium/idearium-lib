'use strict';

const fetch = require('isomorphic-fetch');

const parseBody = (response) => {
    if (response.headers.get('Content-Type').includes('application/json')) {
        return response.json();
    }

    return response.text();
};

const parseResponse = async (response) => {
    response.result = await parseBody(response);

    return response;
};

const fetchApi = async (url, { headers, ...options } = {}) => {
    const opts = { ...options };

    opts.headers = { 'content-type': 'application/json', ...headers };

    return parseResponse(await fetch(url, opts));
};

module.exports = fetchApi;
