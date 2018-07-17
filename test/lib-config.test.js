'use strict';

jest.mock('/app/config/config.js', () => ({
    phone: 1234,
    title: 'development',
}));

const path = require('path');
const Config = require('../lib/config');
const dir = path.resolve(__dirname, '..', 'config');

describe('class Config', () => {

    describe('create an instance', () => {

        test('should fail, if the dir parameter is not provided', () => {

            expect(() => {
                return new Config();
            }).toThrow();

        });

        test('should load the config files from the provided dir', () => {

            const config = new Config(dir);

            expect(config.get('title')).toBe('development');
            expect(config.get('phone')).toBe(1234);

        });

        test('should set and get a keyed value', () => {

            const config = new Config(dir);

            config.set('url', 'google.com');
            expect(config.get('url')).toBe('google.com');

        });

        test('should set \'env\' to `process.env.NODE_ENV`', () => {

            const config = new Config(dir);

            // eslint-disable-next-line no-process-env
            expect(config.get('env')).toBe(process.env.NODE_ENV);

        });

        test('should set `process.env.NODE_ENV` to `true`', () => {

            const config = new Config(dir);

            // eslint-disable-next-line no-process-env
            expect(config.get(process.env.NODE_ENV)).toBe(true);

        });

        test('allows you to rescope the environment variables', () => {

            const config = new Config(dir, {
                foo: 'bar',
                one: 'A',
            });

            expect(config.get('foo')).toBe('bar');
            expect(config.get('one')).toBe('A');
            // eslint-disable-next-line no-undefined
            expect(config.get('env')).toBe(undefined);

        });

    });

    describe('create multiple instances', () => {

        test('should work', () => {

            const config1 = new Config(dir);
            const config2 = new Config(dir);

            config1.set('hello', 'config1');
            config2.set('hello', 'config2');

            expect(config1.get('hello')).toBe('config1');
            expect(config2.get('hello')).toBe('config2');

        });

    });

});
