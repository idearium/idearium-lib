'use strict';

const parseBody = async (response) => {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    let body = '';

    for await (const chunk of response.body) {
        body += decoder.decode(chunk);
    }

    if (
        response.headers.get('Content-Type').includes('application/json') &&
        body.length
    ) {
        return JSON.parse(body);
    }

    return body;
};

const parseResponse = async (response) => {
    console.log('response.headers', response.headers);
    console.log(
        'response.headers',
        /^(application\/json|text\/)/i.test(
            response.headers.get('Content-Type'),
        ),
    );
    if (
        response.headers &&
        response.headers.get('Content-Type') &&
        /^(application\/json|text\/)/i.test(
            response.headers.get('Content-Type'),
        ) &&
        response.body
    ) {
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

    return await parseResponse(response);
};

module.exports = fetchApi;
