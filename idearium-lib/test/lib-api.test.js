'use strict';

const Api = require('../lib/api');

describe('class Api', () => {

    test('should fail if the baseUrl parameter is not provided', () => {

        expect(() => {

            return new Api();

        }).toThrow();

    });

    test('should use the defaults', () => {

        const api = new Api('https://test.com', { test: 'test' });

        expect(api.defaults).toEqual({ test: 'test' });

    });

    test('should provide a requestApi function', () => {

        const api = new Api('https://test.com');

        expect(api.requestApi('/test')).toEqual({ uri: 'https://test.com/test' });

    });

    test('should add an endpoint', () => {

        const api = new Api('https://test.com');

        api.addEndpoint('tests', { getTest: () => api.requestApi('/test') });

        expect(Object.keys(api.tests).sort()).toEqual(['getTest']);
        expect(api.tests.getTest()).toEqual({ uri: 'https://test.com/test' });

    });

});
