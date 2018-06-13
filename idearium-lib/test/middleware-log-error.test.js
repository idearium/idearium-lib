'use strict';

jest.mock('/app/config/config.js', () => ({
    logEntriesToken: '00000000-0000-0000-0000-000000000000',
    logLevel: 'debug',
    logLocation: 'local',
    logToStdout: false,
    production: false,
}));

const fs = require('fs');
const path = require('path');
const express = require('express');
const request = require('supertest');
const mitm = require('mitm');
const logError = require('../middleware/log-error');
const dir = path.resolve(__dirname, '..', 'logs');
const rimraf = require('rimraf');

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

describe('logError', function () {

    // This is run after common-config and will have therefore cached the config from the previous test.
    beforeAll((done) => {

        // Create the directory for the logger
        rimraf('../logs', () => {

            if (fs.existsSync(dir)) {
                return done();
            }

            return fs.mkdir(dir, done);

        });

    });

    // Clear the log file after each run.
    afterEach((done) => {

        const file = path.join(process.cwd(), 'logs', 'error.log');

        // Create or empty the file
        fs.writeFile(file, '', 'utf-8', done);

    });

    it('is an Express middleware function', function () {

        const middlewareFn = logError;

        expect(typeof middlewareFn).toBe('function');

    });

    it('will log locally to file', (done) => {

        const app = createApp();

        // Mount some middleware that will throw an error.
        app.get('/', function (req, res, next) {
            return next(new Error('A file error.'));
        });

        // Mount the middleware to log the error
        app.use(logError);

        // Mount some middleware to handle the error
        // eslint-disable-next-line no-unused-vars
        app.use(function (err, req, res, next) {
            return res.status(500).end(err.toString());
        });

        // Run the test
        createAgent(app)
            .get('/')
            .expect(500, /Error: A file error/)
            // eslint-disable-next-line no-unused-vars
            .end(function (err, res) {

                // Was there an error.
                if (err) {
                    return done(err);
                }

                // Now we should make sure the local file has some log data in it.
                // Verify the log exists.
                fs.readFile(path.join(process.cwd(), 'logs', 'error.log'), 'utf8', function (readErr, content) {

                    // Handle any read errors
                    if (readErr) {
                        return done(readErr);
                    }

                    // Check out results.
                    expect(content).toMatch(/A file error/);

                    // We're all done
                    return done();

                });

            });

    });

    it('the username if it exists in req', (done) => {

        const app = createApp();

        // Mount some middleware that will throw an error.
        app.get('/', function (req, res, next) {

            req.user = {
                _id: '000000000000',
                username: 'foobar',
            };

            return next(new Error('A user error.'));

        });

        // Mount the middleware to log the error
        app.use(logError);

        // Mount some middleware to handle the error
        // eslint-disable-next-line no-unused-vars
        app.use(function (err, req, res, next) {
            return res.status(500).end(err.toString());
        });

        // Run the test
        createAgent(app)
            .get('/')
            .expect(500, /Error: A user error/)
            // eslint-disable-next-line no-unused-vars
            .end(function (err, res) {

                // Was there an error.
                if (err) {
                    return done(err);
                }

                // Now we should make sure the local file has some log data in it.
                // Verify the log exists.
                fs.readFile(path.join(process.cwd(), 'logs', 'error.log'), 'utf8', function (readErr, content) {

                    // Handle any read errors
                    if (readErr) {
                        return done(readErr);
                    }

                    // Check out results.
                    expect(content).toMatch(/A user error/);
                    expect(content).toMatch(/foobar/);

                    // We're all done
                    return done();

                });

            });

    });

    it('remotely via a stream', (done) => {

        const app = createApp();
        const mock = mitm();
        const config = require('../common/config');

        // Update the config to log remotely
        config.set('logLocation', 'remote');

        // A proxy function used to ensure mock.disable is always run whenever this test calls `done`.
        const callDone = () => {

            mock.disable();
            done.apply(null, arguments);

        }

        // Don't intercept supertest requests, only the logging requests
        mock.on('connect', function (socket, opts) {
            if (opts.host === '127.0.0.1') {
                socket.bypass();
            }
        });

        // Intercept requests to the remote logging server, and check them.
        // eslint-disable-next-line no-unused-vars
        mock.on('connection', function (socket, opts) {
            socket.on('data', function (buffer) {

                const msg = buffer.toString();

                // Check out results.
                expect(msg).toMatch(/A remote error/);
                expect(msg).toMatch(/idearium-lib:middleware:log-error/);
                expect(msg).toMatch(/"level":50/);

                return callDone();

            });
        });

        // Mount some middleware that will throw an error.
        app.get('/', function (req, res, next) {
            return next(new Error('A remote error.'));
        });

        // Mount the middleware to log the error
        app.use(logError);

        // Mount some middleware to handle the error
        // eslint-disable-next-line no-unused-vars
        app.use(function (err, req, res, next) {
            return res.status(500).end(err.toString());
        });

        // Run the test
        createAgent(app)
            .get('/')
            .expect(500, /Error: A remote error/)
            // eslint-disable-next-line no-unused-vars
            .end(function (err, res) {

                // Was there an error.
                if (err) {
                    return callDone(err);
                }

            });

    });

    afterAll((done) => {
        rimraf('../logs', done);
    });

});
