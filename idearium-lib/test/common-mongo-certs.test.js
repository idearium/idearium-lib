/* eslint-env node, mocha */

'use strict';

jest.mock('/app/config/config.js', () => ({ env: 'test' }));

let path = require('path'),
    copy = require('copy-dir'),
    rimraf = require('rimraf'),
    dir = path.resolve(__dirname);

describe('common/mongo/certs', () => {

    // This is run after common-config and will have therefore cached the config from the previous test.
    // Set the mqUrl value as common/mq/client uses it.
    beforeAll((done) => {

        // Move the test files into place
        copy(path.resolve(dir, 'data', 'mongo-certs'), path.join(dir, '..', 'mongo-certs', process.env.NODE_ENV), done);

    });

    it('will load the certificates, specific to environment', (done) => {

        require('../common/mongo/certs')
            .then((certs) => {

                expect(Array.isArray(certs)).toBe(true);
                expect(certs).toHaveLength(2);

                return done();

            })
            .catch(done);

    });

    afterAll((done) => {

        rimraf(path.join(dir, '..', 'mongo-certs'), done);

    });

});
