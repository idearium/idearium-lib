'use strict';

const parseBody = async (response) => {
    const decoder = new TextDecoderStream('utf-8', { fatal: true });
    let body = '';

    for await (const chunk of response.body.pipeThrough(decoder)) {
        body += chunk;
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

const fetchApi = async (url, fetchOptions = {}) => {
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

    return await parseResponse(response);
};

module.exports = fetchApi;
