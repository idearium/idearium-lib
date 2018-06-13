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
const logRequest = require('../middleware/log-request');
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

describe('logRequest', () => {

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

    it('is an Express middleware function', () => {

        expect(typeof logRequest).toBe('function');

    });

    it('will log locally to file', (done) => {

        const app = createApp();

        // Mount the middleware to log the request
        app.use(logRequest);

        // Mount some middleware that will just continue.
        app.get('/', function (req, res, next) {
            return next();
        });

        // eslint-disable-next-line no-unused-vars
        app.get('/', function (req, res, next) {
            return res.status(200).end('OK');
        });

        // Run the test
        createAgent(app)
            .get('/')
            .expect(200, /OK/)
            // eslint-disable-next-line no-unused-vars
            .end(function (err, res) {

                // Was there an error.
                if (err) {
                    return done(err);
                }

                // Now we should make sure the local file has some log data in it.
                // Verify the log exists.
                fs.readFile(path.join(process.cwd(), 'logs', 'request.log'), 'utf8', function (readErr, content) {

                    // Handle any read errors
                    if (readErr) {
                        return done(readErr);
                    }

                    // Check out results.
                    expect(content).toMatch(/idearium-lib:middleware:log-request/);
                    expect(content).toMatch(/"method":"GET"/);
                    expect(content).toMatch(/"url":"\/"/);

                    // We're all done
                    return done();

                });

            });

    });

    it('will not log excluded routes', (done) => {

        const app = createApp();
        const agent = createAgent(app);
        let count = 0;

        // Mount the middleware to log the request
        app.use(logRequest);

        // Mount some middleware that will just continue.
        app.get('/', function (req, res, next) {
            return next();
        });

        // eslint-disable-next-line no-unused-vars
        app.get('/', function (req, res, next) {

            count += 1;

            return res.status(200).end('OK');

        });

        // eslint-disable-next-line no-unused-vars
        app.get('/admin/public/file.txt', function (req, res, next) {

            count++;

            return res.status(200).end('OK');

        });

        // Run the test
        agent
            .get('/')
            .expect(200, /OK/)
            // eslint-disable-next-line no-unused-vars
            .end(function (err, res) {

                // Was there an error.
                if (err) {
                    return done(err);
                }

                agent
                    .get('/admin/public/file.txt')
                    .expect(200, /OK/)
                    // eslint-disable-next-line no-unused-vars
                    .end(function (publicErr, publicRes) {

                        if (publicErr) {
                            return done(publicErr);
                        }

                        // Now we should make sure the local file has some log data in it.
                        // Verify the log exists.
                        fs.readFile(path.join(process.cwd(), 'logs', 'request.log'), 'utf8', function (readErr, content) {

                            // Handle any read errors
                            if (readErr) {
                                return done(readErr);
                            }

                            // Make sure both middleware were executed
                            expect(count).to.eql(2);

                            // Check out results.
                            expect(content).toMatch(/idearium-lib:middleware:log-request/);
                            expect(content).toMatch(/"method":"GET"/);
                            expect(content).toMatch(/"url":"\/"/);

                            // Shouldn't log the excluded routes
                            expect(content).not.toMatch(/"url":"\/admin\/public\/file.txt"/);

                            // We're all done
                            return done();

                        });

                    });

            });

    });

    it('the username if it exists in req', (done) => {

        const app = createApp();

        // Mount the middleware to log the reuqest
        app.use(logRequest);

        // Mount some middleware that will just continue.
        app.get('/user', function (req, res, next) {

            req.user = {
                _id: '000000000000',
                username: 'foobar',
            };

            return next();

        });

        // eslint-disable-next-line no-unused-vars
        app.get('/user', function (req, res, next) {
            return res.status(200).end('OK');
        });

        // Run the test
        createAgent(app)
            .get('/user')
            .expect(200, /OK/)
            // eslint-disable-next-line no-unused-vars
            .end(function (err, res) {

                // Was there an error.
                if (err) {
                    return done(err);
                }

                // Now we should make sure the local file has some log data in it.
                // Verify the log exists.
                fs.readFile(path.join(process.cwd(), 'logs', 'request.log'), 'utf8', function (readErr, content) {

                    // Handle any read errors
                    if (readErr) {
                        return done(readErr);
                    }

                    // Check out results.
                    expect(content).toMatch(/idearium-lib:middleware:log-request/);
                    expect(content).toMatch(/"method":"GET"/);
                    expect(content).toMatch(/"url":"\/user"/);
                    expect(content).toMatch(/"username":"foobar"/);

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

        };

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
                expect(msg).toMatch(/idearium-lib:middleware:log-request/);
                expect(msg).toMatch(/"method":"GET"/);
                expect(msg).toMatch(/"url":"\/log-request-stream"/);

                return callDone();

            });
        });

        // Mount the middleware to log the reuqest
        app.use(logRequest);

        // Mount some middleware that will just continue.
        app.get('/log-request-stream', function (req, res, next) {
            return next();
        });

        // eslint-disable-next-line no-unused-vars
        app.get('/log-request-stream', function (req, res, next) {
            return res.status(200).end('OK');
        });

        // Run the test
        createAgent(app)
            .get('/log-request-stream')
            .expect(200, /OK/)
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
