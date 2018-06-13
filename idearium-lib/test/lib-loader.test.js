'use strict';

const path = require('path');
const fs = require('fs');
const Config = require('../lib/config');
const Loader = require('../lib/loader');
const dir = path.resolve(__dirname, 'lib');

describe('class Loader', () => {

    beforeAll((done) => {

        fs.mkdir(dir, (err) => {

            if (err) {
                return done(err);
            }

            fs.writeFile(`${dir}/log-exception.js`, '', (writeErr) => {

                if (writeErr) {
                    return done(writeErr);
                }

                fs.writeFile(`${dir}/log-request.js`, '', done);

            });

        });

    });

    it('should throw, if the dir parameter is not provided', () => {

        try {

            new Config().load();

        } catch (err) {

            expect(err.message).toMatch(/dir/);

        }

    });

    describe('works asynchronously (promises)', () => {

        it('should load files', (done) => {

            const loader = new Loader();

            loader.load(dir).then((files) => {

                expect(Object.keys(files).sort()).toEqual(['logException', 'logRequest']);

                return done();

            });

        });

        it('should load files without camel case key names', (done) => {

            const loader = new Loader();

            loader.camelCase = false;

            loader.load(dir).then((files) => {

                expect(Object.keys(files).sort()).toEqual(['log-exception', 'log-request']);

                return done();

            });

        });

        it('should load files with class case key names', (done) => {

            const loader = new Loader();

            loader.classCase = true;

            loader.load(dir).then((files) => {

                expect(Object.keys(files).sort()).toEqual(['LogException', 'LogRequest']);

                return done();

            });

        });

    });

    describe('works synchronously', () => {

        // Create a synchronous instance of the loader.
        const loader = new Loader();

        loader.sync = true;

        it('should load files', () => {
            expect(Object.keys(loader.load(dir)).sort()).toEqual(['logException', 'logRequest']);
        });

        it('should load files without camel case key names', () => {
            loader.camelCase = false;
            expect(Object.keys(loader.load(dir)).sort()).toEqual(['log-exception', 'log-request']);
        });

        it('should load files with class case key names', () => {
            loader.camelCase = true;
            loader.classCase = true;
            expect(Object.keys(loader.load(dir)).sort()).toEqual(['LogException', 'LogRequest']);
        });

    });

    afterAll((done) => {

        fs.unlink(`${dir}/log-exception.js`, (err) => {

            if (err) {
                return done(err);
            }

            fs.unlink(`${dir}/log-request.js`, (deleteErr) => {

                if (deleteErr) {
                    return done(deleteErr);
                }

                fs.rmdir(dir, done);

            });

        });

    });

});
