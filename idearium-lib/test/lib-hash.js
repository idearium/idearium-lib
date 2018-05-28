/* eslint-env node, mocha */

'use strict';

var expect = require('chai').expect,
    Hash = require('../lib/hash');

describe('class Hash', function () {

    const identifier = 'string.to.hash';

    describe('create an instance', function () {

        it('should fail, if the identifier parameter is not provided', function () {

            expect(function () {
                return new Hash();
            }).to.throw(Error, /identifier/);

        });

        it('should instantiate, if the identifier parameter is provided', function () {

            const hash = new Hash(identifier);

            expect(hash).to.exist;
            expect(hash.identifier).to.exist;
            expect(hash.identifier).to.equal(identifier);
            expect(hash.hashed).to.not.exist;

        });

        it('should hash the identifier', function (done) {

            const hash = new Hash(identifier);

            hash.hash(function (err, hashed) {

                if (err) {
                    return err;
                }

                expect(hash.hashed).to.exist;
                expect(hashed).to.exist;

                return done();

            });

        });

        it('successfully compare a hash', function (done) {

            const hash = new Hash(identifier);

            hash.hash(function (err, hashed) {

                if (err) {
                    return err;
                }

                expect(hash.hashed).to.exist;
                expect(hashed).to.exist;

                hash.compare(hashed, function (compareErr, comparison) {

                    if (compareErr) {
                        return compareErr;
                    }

                    expect(comparison).to.exist;
                    expect(comparison).to.be.true;

                    return done();

                });

            });

        });

        it('successfully fail a hash compare', function (done) {

            const hash = new Hash(identifier);

            hash.hash(function (err, hashed) {

                if (err) {
                    return err;
                }

                expect(hash.hashed).to.exist;
                expect(hashed).to.exist;

                hash.compare('some.string', function (compareErr, comparison) {

                    if (compareErr) {
                        return compareErr;
                    }

                    expect(comparison).to.exist;
                    expect(comparison).to.be.false;

                    return done();

                });

            });

        });

        it('successfully compare a hash, without prior hashing', function (done) {

            const hash = new Hash(identifier);

            hash.compare('$2a$10$H0S.zE4oymFcfWzcqa9OFuxCQwixGw7WolM.OjWD2hDz0/BbpsCT6', function (compareErr, comparison) {

                if (compareErr) {
                    return compareErr;
                }

                expect(comparison).to.exist;
                expect(comparison).to.be.true;

                return done();

            });

        });

    });

});
