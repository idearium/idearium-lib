'use strict';

const parseBody = async (response, opts) => {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const body = [];
    const isObjectMode = opts?.objectMode || false;

    for await (const chunk of response.body) {
        const value = decoder.decode(chunk);

        if (value.match(/\n/)) {
            body.push(...value.split('\n').filter((val) => val.length));
        }

        if (!value.match(/\n/)) {
            body.push(value);
        }
    }

    if (isObjectMode) {
        return body.length > 1
            ? body.map((chunk) => JSON.parse(chunk))
            : JSON.parse(body[0]);
    }

    if (
        response.headers.get('Content-Type').includes('application/json') &&
        body.length
    ) {
        return JSON.parse(body.join(''));
    }

    return body.join('');
};

const parseResponse = async (response, opts) => {
    if (
        response.headers &&
        response.headers.get('Content-Type') &&
        /^(application\/json|text\/)/i.test(
            response.headers.get('Content-Type'),
        ) &&
        response.body
    ) {
        response.result = await parseBody(response, opts);
    }

    return response;
};

const fetchApi = async (url, fetchOptions = {}, opts = {}) => {
    const headers = {};

    if (fetchOptions?.headers) {
        Object.keys(fetchOptions.headers).forEach(
            (key) => (headers[key.toLowerCase()] = fetchOptions.headers[key]),
        );
    }

    if (!headers['content-type']) {
        headers['content-type'] = 'application/json';
    }

    fetchOptions.headers = headers;

    const response = await fetch(url, fetchOptions);

    return await parseResponse(response, opts);
};

module.exports = fetchApi;
