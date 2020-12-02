'use strict';

const fetch = require('isomorphic-fetch');
const { safePromise } = require('@idearium/utils');

const parseBody = (response) => {
    if (response.headers.get('Content-Type').includes('application/json')) {
        return response.json();
    }

    return response.text();
};

const parseResponse = async (response) => {
    const { ok, status } = response;

    if (!ok) {
        throw new Error(response.statusText);
    }

    const result = await parseBody(response);

    return { ok, result, status };
};

const fetchApi = async (url, { headers } = {}) => {
    const [apiError, apiResponse] = await safePromise(
        fetch(url, {
            headers: { 'content-type': 'application/json', ...headers }
        })
    );

    if (apiError) {
        return [apiError];
    }

    return safePromise(parseResponse(apiResponse));
};

module.exports = fetchApi;
