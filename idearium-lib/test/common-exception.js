'use strict';

const { expect } = require('chai');
const {
    cleanUp,
    logPath,
    makeConfigs,
    makeLogs,
} = require('./util');
const fs = require('fs');
const path = require('path');

describe('common/exception', function () {

    const pe = process.exit;
    let exception;

    before(() => Promise.all([
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

    it('is a function', function () {
        expect(exception).to.be.a('function');
    });

    it('will log to log.error', function (done) {

        exception(new Error('An exception'));

        // Verify the log exists.
        fs.readFile(path.join(logPath, 'application.log'), 'utf8', function (err, content) {

            // Handle any errors
            if (err) {
                return done(err);
            }

            // Check out results.
            expect(content).to.match(/An exception/);

            return done();

        });

    });

    after(() => cleanUp()
        .then(() => {

            process.exit = pe;

            return Promise.resolve();

        }));

});
