/* eslint-env node, mocha */

'use strict';

const { makeConfigs } = require('./util');

var path = require('path'),
    fs = require('fs'),
    dir = path.resolve(__dirname, '..', 'config');

describe('common/config', () => {

    let config;

    beforeAll(() => makeConfigs('module.exports = { "title": "development", "phone": 1234 };')
        .then(() => (config = require('../common/config'))));

    it('will load the config', () => {

        expect(config.get('title')).toBe('development');
        expect(config.get('phone')).toBe(1234);

        config.set('url', 'google.com');
        expect(config.get('url')).toBe('google.com');

    });

    afterAll((done) => {
        fs.unlink(dir + '/config.js', function (err) {
            if (err) {
                return done(err);
            }
            fs.rmdir(dir, done);
        });
    });

});
