'use strict';

const { expect } = require('chai');
const Api = require('../lib/api');

describe('class Api', function () {

    it('should fail if the baseUrl parameter is not provided', function () {

        expect(function () {

            return new Api();

        }).to.throw(Error);

    });

    it('should use the defaults', function () {

        const api = new Api('https://test.com', { test: 'test' });

        expect(api.defaults).to.eql({ test: 'test' });

    });

    it('should provide a requestApi function', function () {

        const api = new Api('https://test.com');

        expect(api.requestApi('/test')).to.eql({ uri: 'https://test.com/test' });

    });

    it('should add an endpoint', function () {

        const api = new Api('https://test.com');

        api.addEndpoint('tests', { getTest: () => api.requestApi('/test') });

        expect(api.tests).to.have.all.keys('getTest');
        expect(api.tests.getTest()).to.eql({ uri: 'https://test.com/test' });

    });

});
