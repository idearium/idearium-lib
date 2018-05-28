'use strict';

/* eslint-env node, mocha */

var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    request = require('supertest'),
    expect = require('chai').expect,
    mitm = require('mitm'),
    logError = require('../middleware/log-error'),
    dir = path.resolve(__dirname, '..', 'logs'),
    rimraf = require('rimraf');

/**
 * Helper function to create an instance of an Express app.
 * @return {Object} The Express app.
 */
function createApp () {
    return express();
}

/**
 * Helper function to create a supertest agent for testing the middleware with.
 * @param  {Object} app An Express app.
 * @return {Object}     A supertest agent which can be used to test the middelware.
 */
function createAgent (app) {
    return request.agent(app);
}

describe('logError', function () {

    // Sometimes there is a bit of lag when writing to the socket and file system.
    // Allow two retries on these tests.
    this.retries(2);

    // This is run after common-config and will have therefore cached the config from the previous test.
    before(function(done) {

        let config = require('../common/config');

        config.set('logLocation', 'local');
        config.set('logLevel', 'debug');
        config.set('logToStdout', false);
        config.set('logEntriesToken', '00000000-0000-0000-0000-000000000000');
        config.set('production', false);

        // Create the directory for the logger
        rimraf('../logs', () => {

            if (fs.existsSync(dir)) {
                return done();
            }

            return fs.mkdir(dir, done);

        });

    });

    // Clear the log file after each run.
    afterEach(function (done) {

        const file = path.join(process.cwd(), 'logs', 'error.log');

        // Create or empty the file
        fs.writeFile(file, '', 'utf-8', done);

    });

    it('is an Express middleware function', function () {

        let middlewareFn = logError;

        expect(middlewareFn).to.be.a('function');

    });

    it('will log locally to file', function (done) {

        let app = createApp();

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
                expect(content).to.match(/A file error/);

                // We're all done
                return done();

            });

        });

    });

    it('the username if it exists in req', function (done) {

        let app = createApp();

        // Mount some middleware that will throw an error.
        app.get('/', function (req, res, next) {

            req.user = {
                username: 'foobar',
                _id: '000000000000'
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
                expect(content).to.match(/A user error/);
                expect(content).to.match(/foobar/);

                // We're all done
                return done();

            });

        });

    });

    it('remotely via a stream', function (done) {

        let app = createApp(),
            mock = mitm(),
            config = require('../common/config');

        // Update the config to log remotely
        config.set('logLocation', 'remote');

        // A proxy function used to ensure mock.disable is always run whenever this test calls `done`.
        function callDone () {
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

                var msg = buffer.toString();

                // Check out results.
                expect(msg).to.match(/A remote error/);
                expect(msg).to.match(/idearium-lib:middleware:log-error/);
                expect(msg).to.match(/"level":50/);

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

    after(function (done) {
        rimraf('../logs', done);
    });

});
