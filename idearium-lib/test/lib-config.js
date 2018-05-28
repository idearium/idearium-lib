/* eslint-env node, mocha */

'use strict';

var expect = require('chai').expect,
    path = require('path'),
    fs = require('fs'),
    Config = require('../lib/config'),
    dir = path.resolve(__dirname, '..', 'config');

describe('class Config', function () {

    before(function(done) {
        fs.mkdir(dir, function (err) {
            if (err) {
                return done(err);
            }
            fs.writeFile(dir + '/config.js', 'module.exports = { "title": "development", "phone": 1234 };', done);
        });
    });

    describe('create an instance', function () {

        it('should fail, if the dir parameter is not provided', function () {

            expect(function () {
                return new Config();
            }).to.throw(Error);

        });

        it('should load the config files from the provided dir', function () {

            var config = new Config(dir);

            expect(config.get('title')).to.equal('development');
            expect(config.get('phone')).to.equal(1234);

        });

        it('should set and get a keyed value', function () {

            var config = new Config(dir);

            config.set('url', 'google.com');
            expect(config.get('url')).equal('google.com');

        });

        it('should set \'env\' to `process.env.NODE_ENV`', function () {

            var config = new Config(dir);

            expect(config.get('env')).equal(process.env.NODE_ENV);

        });

        it('should set `process.env.NODE_ENV` to `true`', function () {

            var config = new Config(dir);

            expect(config.get(process.env.NODE_ENV)).equal(true);

        });

    });

    describe('create multiple instance', function () {

        it('should work', function () {

            var config1 = new Config(dir),
                config2 = new Config(dir);

            config1.set('hello', 'config1');
            config2.set('hello', 'config2');

            expect(config1.get('hello')).to.equal('config1');
            expect(config2.get('hello')).to.equal('config2');

        });

    });

    after(function (done) {
        fs.unlink(dir + '/config.js', function (err) {
            if (err) {
                return done(err);
            }
            fs.rmdir(dir, done);
        });
    });

});
