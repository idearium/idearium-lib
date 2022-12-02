'use strict';

jest.mock('/app/config/config.js', () => ({
    logLevel: 'debug',
}));

const { logPath } = require('./util');
const fs = require('fs');
const path = require('path');

describe('common/exception', () => {

    const pe = process.exit;
    let exception;

    beforeAll(() => {

        process.exit = () => { };

        exception = require('../common/exception');

    });

    test('is a function', () => {
        expect(typeof exception).toBe('function');
    });

    test('will log to log.error', (done) => {

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

    afterAll(() => {

        process.exit = pe;

    });

});
