'use strict';

const Api = require('../lib/api');

describe('class Api', () => {

    it('should fail if the baseUrl parameter is not provided', () => {

        expect(() => {

            return new Api();

        }).toThrow();

    });

    it('should use the defaults', () => {

        const api = new Api('https://test.com', { test: 'test' });

        expect(api.defaults).toEqual({ test: 'test' });

    });

    it('should provide a requestApi function', () => {

        const api = new Api('https://test.com');

        expect(api.requestApi('/test')).toEqual({ uri: 'https://test.com/test' });

    });

    it('should add an endpoint', () => {

        const api = new Api('https://test.com');

        api.addEndpoint('tests', { getTest: () => api.requestApi('/test') });

        expect(Object.keys(api.tests).sort()).toEqual(['getTest']);
        expect(api.tests.getTest()).toEqual({ uri: 'https://test.com/test' });

    });

});
