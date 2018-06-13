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

        it('should fail, if the dir parameter is not provided', () => {

            expect(() => {
                return new Config();
            }).toThrow();

        });

        it('should load the config files from the provided dir', () => {

            const config = new Config(dir);

            expect(config.get('title')).toBe('development');
            expect(config.get('phone')).toBe(1234);

        });

        it('should set and get a keyed value', () => {

            const config = new Config(dir);

            config.set('url', 'google.com');
            expect(config.get('url')).toBe('google.com');

        });

        it('should set \'env\' to `process.env.NODE_ENV`', () => {

            const config = new Config(dir);

            expect(config.get('env')).toBe(process.env.NODE_ENV);

        });

        it('should set `process.env.NODE_ENV` to `true`', () => {

            const config = new Config(dir);

            expect(config.get(process.env.NODE_ENV)).toBe(true);

        });

    });

    describe('create multiple instance', () => {

        it('should work', () => {

            const config1 = new Config(dir);
            const config2 = new Config(dir);

            config1.set('hello', 'config1');
            config2.set('hello', 'config2');

            expect(config1.get('hello')).toBe('config1');
            expect(config2.get('hello')).toBe('config2');

        });

    });

});
