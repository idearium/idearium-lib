'use strict';

const parseBody = async (response) => {
    let body = '';

    for await (const chunk of response.body) {
        body += new TextDecoder().decode(chunk);
    }

    if (
        response.headers &&
        response.headers.get('Content-Type') &&
        response.headers.get('Content-Type').includes('application/json')
    ) {
        return JSON.parse(body);
    }

    return body;
};

const parseResponse = async (response) => {
    response.result = await parseBody(response);

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

    return await parseResponse(await fetch(url, opts));
};

module.exports = fetchApi;
