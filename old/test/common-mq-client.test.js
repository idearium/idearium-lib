/* eslint-env node, mocha */

'use strict';

jest.mock('/app/config/config.js', () => ({
    env: 'test',
    logLevel: 'debug',
    logLocation: 'local',
    logToStdout: true,
}));

let path = require('path'),
    copy = require('copy-dir'),
    rimraf = require('rimraf'),
    dir = path.resolve(__dirname),
    conf = require('./conf');

describe('common/mq/client', function () {

    // This is run after common-config and will have therefore cached the config from the previous test.
    // Set the mqUrl value as common/mq/client uses it.
    beforeAll((done) => {

        require('../common/config').set('mqUrl', conf.rabbitUrl);

        // Move the test files into place
        copy(path.resolve(dir, 'data', 'mq-certs'), path.join(dir, '..', 'mq-certs', process.env.NODE_ENV), done);

    });

    test('will connect to rabbit mq', (done) => {

        // Catch and proxy any errors to `done`.
        try {

            // Create an instance of `mq.Client`.
            var mqClient = require('../common/mq/client');

            // When the `connect` event is fired, we're done.
            // Only listen once, because `../common/mq/client` is used in later tests.
            // It will be cached, and so we don't want to execute this instance of `done` again.
            mqClient.once('connect', function () {

                // Ensure it successfully loaded all certs.
                expect(Object.keys(mqClient.options).sort()).toEqual(['ca', 'cert', 'key', 'servername']);
                expect(Array.isArray(mqClient.options.ca)).toBe(true);

                return done();

            });

            // Listen for errors and send to `done`.
            mqClient.once('error', done);

        } catch (e) {
            return done(e);
        }

    }, 10000);

    afterAll((done) => {

        rimraf(path.join(dir, '..', 'mq-certs'), done);

    });

});
