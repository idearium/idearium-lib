'use strict';

const express = require('express');
const request = require('supertest');
const configSettings = require('../middleware/config-settings');

jest.mock('/app/config/config.js', () => ({
    bar: 'bar',
    foo: 'foo',
}));

/**
 * Helper function to create an instance of an Express app.
 * @return {Object} The Express app.
 */
const createApp = () => {
    return express();
};

/**
 * Helper function to create a supertest agent for testing the middleware with.
 * @param  {Object} app An Express app.
 * @return {Object}     A supertest agent which can be used to test the middelware.
 */
const createAgent = (app) => {
    return request.agent(app);
};

describe('configSettings', () => {

    it('is an Express middleware function', () => {

        const middlewareFn = configSettings;

        expect(typeof middlewareFn).toBe('function');

    });

    it('will return 404 unless an authenticated request is made', function (done) {

        const app = createApp();

        app.get('/config', configSettings);

        createAgent(app)
            .get('/config')
            .expect(404, done);

    });

    it('will return a json response with configuration data', function (done) {

        const app = createApp();

        // Mount the middleware so that we can test it.
        app.get('/config', configSettings);

        // Check the body is as it should be.
        const bodyMatches = (res) => {

            if (!('foo' in res.body)) {
                throw new Error('Missing foo');
            }

            if (!('bar' in res.body)) {
                throw new Error('Missing bar');
            }

        };

        // Run the test.
        createAgent(app)
            .get('/config?access=Id3Ar1um')
            .expect('Content-Type', /json/)
            .expect(bodyMatches)
            .expect(200, done);

    });

});
