'use strict';

const Hash = require('../lib/hash');

describe('class Hash', () => {

    const identifier = 'string.to.hash';

    describe('create an instance', () => {

        test('should fail, if the identifier parameter is not provided', () => {

            expect(() => {
                return new Hash();
            }).toThrow(/identifier/);

        });

        test('should instantiate, if the identifier parameter is provided', () => {

            const hash = new Hash(identifier);

            expect(hash).toBeTruthy();
            expect(hash.identifier).toBeTruthy();
            expect(hash.identifier).toBe(identifier);
            expect(hash.hashed).toBeFalsy();

        });

        test('should hash the identifier', function (done) {

            const hash = new Hash(identifier);

            hash.hash(function (err, hashed) {

                if (err) {
                    return err;
                }

                expect(hash.hashed).toBeTruthy();
                expect(hashed).toBeTruthy();

                return done();

            });

        });

        test('successfully compare a hash', function (done) {

            const hash = new Hash(identifier);

            hash.hash(function (err, hashed) {

                if (err) {
                    return err;
                }

                expect(hash.hashed).toBeTruthy();
                expect(hashed).toBeTruthy();

                hash.compare(hashed, function (compareErr, comparison) {

                    if (compareErr) {
                        return compareErr;
                    }

                    expect(comparison).toBe(true);

                    return done();

                });

            });

        });

        test('successfully fail a hash compare', function (done) {

            const hash = new Hash(identifier);

            hash.hash(function (err, hashed) {

                if (err) {
                    return err;
                }

                expect(hash.hashed).toBeTruthy();
                expect(hashed).toBeTruthy();

                hash.compare('some.string', function (compareErr, comparison) {

                    if (compareErr) {
                        return compareErr;
                    }

                    expect(comparison).toBe(false);

                    return done();

                });

            });

        });

        test('successfully compare a hash, without prior hashing', function (done) {

            const hash = new Hash(identifier);

            hash.compare('$2a$10$H0S.zE4oymFcfWzcqa9OFuxCQwixGw7WolM.OjWD2hDz0/BbpsCT6', function (compareErr, comparison) {

                if (compareErr) {
                    return compareErr;
                }

                expect(comparison).toBeTruthy();
                expect(comparison).toBe(true);

                return done();

            });

        });

    });

});
