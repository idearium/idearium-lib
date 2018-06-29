/* eslint-env node, mocha */

'use strict';

jest.mock('/app/config/config.js', () => ({ env: 'test' }));

let path = require('path'),
    copy = require('copy-dir'),
    rimraf = require('rimraf'),
    dir = path.resolve(__dirname);

describe('common/mq/certs', function () {

    // This is run after common-config and will have therefore cached the config from the previous test.
    // Set the mqUrl value as common/mq/client uses it.
    beforeAll((done) => {

        // Move the test files into place
        copy(path.resolve(dir, 'data', 'mq-certs'), path.join(dir, '..', 'mq-certs', process.env.NODE_ENV), done);

    });

    test('will load the certificates, specific to environment', (done) => {

        require('../common/mq/certs')
            .then((optsCerts) => {

                expect(Object.keys(optsCerts).sort()).toEqual(['ca', 'cert', 'key']);

                expect(optsCerts.key instanceof Buffer).toBe(true);
                expect(optsCerts.cert instanceof Buffer).toBe(true);
                expect(Array.isArray(optsCerts.ca)).toBe(true);

                return done();

            })
            .catch(done);

    });

    afterAll((done) => {

        rimraf(path.join(dir, '..', 'mq-certs'), done);

    });

});
