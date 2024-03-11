'use strict';

const { Readable } = require('stream');

const parseBody = async (response) => {
    let bodyStream = response.body;

    // bodyStream is used to bypass a bug in the testing library that causes response.body to be an object.
    // In non-testing environments response.body should always be a ReadableStream.
    if (typeof bodyStream.getReader !== 'function') {
        // If response.body is an object, convert it to a JSON string and then to a ReadableStream
        bodyStream = Readable.from([bodyStream]);
    }

    let body = '';

    for await (const chunk of bodyStream) {
        body += new TextDecoder().decode(chunk);
    }

    if (
        response.headers &&
        response.headers.get('Content-Type') &&
        response.headers.get('Content-Type').includes('application/json') &&
        body.length
    ) {
        return JSON.parse(body);
    }

    return body;
};

const parseResponse = async (response) => {
    if (response.body) {
        response.result = await parseBody(response);
    }

    return response;
};

const fetchApi = async (url, opts = {}) => {
    const headers = {};

    if (opts?.headers) {
        Object.keys(opts.headers).forEach(
            (key) => (headers[key.toLowerCase()] = opts.headers[key]),
        );
    }

    if (!headers['content-type']) {
        headers['content-type'] = 'application/json';
    }

    opts.headers = headers;

    const response = await fetch(url, opts);

    return await parseResponse(response, opts.method || 'GET');
};

module.exports = fetchApi;
