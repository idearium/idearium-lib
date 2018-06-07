'use strict';

const {
    cleanUp,
    logPath,
    makeConfigs,
    makeLogs,
} = require('./util');
const fs = require('fs');
const path = require('path');

describe('common/exception', () => {

    const pe = process.exit;
    let exception;

    beforeAll(() => Promise.all([
        makeConfigs(),
        makeLogs(),
    ])
        .then(() => {

            process.exit = () => { };

            const config = require('../common/config');

            config.set('logLocation', 'local');
            config.set('logLevel', 'debug');
            config.set('logToStdout', true);
            exception = require('../common/exception');

        }));

    it('is a function', () => {
        expect(typeof exception).toBe('function');
    });

    it('will log to log.error', (done) => {

        exception(new Error('An exception'));

        // Verify the log exists.
        fs.readFile(path.join(logPath, 'application.log'), 'utf8', function (err, content) {

            // Handle any errors
            if (err) {
                return done(err);
            }

            // Check out results.
            expect(content).toMatch(/An exception/);

            return done();

        });

    });

    afterAll(() => cleanUp()
        .then(() => {

            process.exit = pe;

            return Promise.resolve();

        }));

});
