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

    describe('defaults new environment configurations', () => {

        test('uses TARGET_ENV when available', () => {

            const config = new Config(dir, { TARGET_ENV: 'local' });

            expect(config.get('env')).toBe('local');

        });

        test('defaults to NODE_ENV when TARGET_ENV is not available', () => {

            const config = new Config(dir, { NODE_ENV: 'development' });

            expect(config.get('env')).toBe('development');

        });

        test('defaults to NODE_ENV when TARGET_ENV is not available', () => {

            const config = new Config(dir, { NODE_ENV: 'development' });

            expect(config.get('env')).toBe('development');

        });

        test('sets isLocal based on TARGET_ENV', () => {

            const configLocal = new Config(dir, { TARGET_ENV: 'local' });
            const configBeta = new Config(dir, { TARGET_ENV: 'beta' });
            const configProduction = new Config(dir, { TARGET_ENV: 'production' });

            expect(configLocal.get('isLocal')).toBe(true);
            expect(configBeta.get('isLocal')).toBe(false);
            expect(configProduction.get('isLocal')).toBe(false);

        });

        test('sets isLocal based on NODE_ENV when TARGET_ENV is not available', () => {

            const configLocal = new Config(dir, { NODE_ENV: 'development' });
            const configBeta = new Config(dir, { NODE_ENV: 'beta' });
            const configProduction = new Config(dir, { NODE_ENV: 'production' });

            expect(configLocal.get('isLocal')).toBe(true);
            expect(configBeta.get('isLocal')).toBe(false);
            expect(configProduction.get('isLocal')).toBe(false);

        });

        test('sets isBeta based on TARGET_ENV', () => {

            const configLocal = new Config(dir, { TARGET_ENV: 'local' });
            const configBeta = new Config(dir, { TARGET_ENV: 'beta' });
            const configProduction = new Config(dir, { TARGET_ENV: 'production' });

            expect(configLocal.get('isBeta')).toBe(false);
            expect(configBeta.get('isBeta')).toBe(true);
            expect(configProduction.get('isBeta')).toBe(false);

        });

        test('sets isBeta based on NODE_ENV when TARGET_ENV is not available', () => {

            const configLocal = new Config(dir, { NODE_ENV: 'development' });
            const configBeta = new Config(dir, { NODE_ENV: 'beta' });
            const configProduction = new Config(dir, { NODE_ENV: 'production' });

            expect(configLocal.get('isBeta')).toBe(false);
            expect(configBeta.get('isBeta')).toBe(true);
            expect(configProduction.get('isBeta')).toBe(false);

        });

        test('sets isProduction based on TARGET_ENV', () => {

            const configLocal = new Config(dir, { TARGET_ENV: 'local' });
            const configBeta = new Config(dir, { TARGET_ENV: 'beta' });
            const configProduction = new Config(dir, { TARGET_ENV: 'production' });

            expect(configLocal.get('isProduction')).toBe(false);
            expect(configBeta.get('isProduction')).toBe(false);
            expect(configProduction.get('isProduction')).toBe(true);

        });

        test('sets isProduction based on NODE_ENV when TARGET_ENV is not available', () => {

            const configLocal = new Config(dir, { NODE_ENV: 'development' });
            const configBeta = new Config(dir, { NODE_ENV: 'beta' });
            const configProduction = new Config(dir, { NODE_ENV: 'production' });

            expect(configLocal.get('isProduction')).toBe(false);
            expect(configBeta.get('isProduction')).toBe(false);
            expect(configProduction.get('isProduction')).toBe(true);

        });

        test('sets isDevelopment based on NODE_ENV', () => {

            const configDevelopment = new Config(dir, { NODE_ENV: 'development', TARGET_ENV: 'local' });
            const configProduction = new Config(dir, { NODE_ENV: 'production', TARGET_ENV: 'beta' });

            expect(configDevelopment.get('isDevelopment')).toBe(true);
            expect(configProduction.get('isProduction')).toBe(false);

        });

    });

    describe('defaults old environment configurations', () => {

        test('uses TARGET_ENV when available', () => {

            const config = new Config(dir, { NODE_ENV: 'development', TARGET_ENV: 'local' });

            expect(config.get('env')).toBe('local');

        });

        test('defaults to NODE_ENV when TARGET_ENV is not available', () => {

            const config = new Config(dir, { NODE_ENV: 'development' });

            expect(config.get('env')).toBe('development');

        });

        test('defaults to NODE_ENV when TARGET_ENV is not available', () => {

            const config = new Config(dir, { NODE_ENV: 'development' });

            expect(config.get('env')).toBe('development');

        });

        test('sets local based on TARGET_ENV', () => {

            const configLocal = new Config(dir, { TARGET_ENV: 'local' });
            const configBeta = new Config(dir, { TARGET_ENV: 'beta' });
            const configProduction = new Config(dir, { TARGET_ENV: 'production' });

            expect(configLocal.get('local')).toBe(true);
            expect(configBeta.get('local')).toBe(false);
            expect(configProduction.get('local')).toBe(false);

        });

        test('sets local based on NODE_ENV when TARGET_ENV is not available', () => {

            const configLocal = new Config(dir, { NODE_ENV: 'development' });
            const configBeta = new Config(dir, { NODE_ENV: 'beta' });
            const configProduction = new Config(dir, { NODE_ENV: 'production' });

            expect(configLocal.get('local')).toBe(true);
            expect(configBeta.get('local')).toBe(false);
            expect(configProduction.get('local')).toBe(false);

        });

        test('sets beta based on TARGET_ENV', () => {

            const configLocal = new Config(dir, { TARGET_ENV: 'local' });
            const configBeta = new Config(dir, { TARGET_ENV: 'beta' });
            const configProduction = new Config(dir, { TARGET_ENV: 'production' });

            expect(configLocal.get('beta')).toBe(false);
            expect(configBeta.get('beta')).toBe(true);
            expect(configProduction.get('beta')).toBe(false);

        });

        test('sets beta based on NODE_ENV when TARGET_ENV is not available', () => {

            const configLocal = new Config(dir, { NODE_ENV: 'development' });
            const configBeta = new Config(dir, { NODE_ENV: 'beta' });
            const configProduction = new Config(dir, { NODE_ENV: 'production' });

            expect(configLocal.get('beta')).toBe(false);
            expect(configBeta.get('beta')).toBe(true);
            expect(configProduction.get('beta')).toBe(false);

        });

        test('sets production based on TARGET_ENV', () => {

            const configLocal = new Config(dir, { TARGET_ENV: 'local' });
            const configBeta = new Config(dir, { TARGET_ENV: 'beta' });
            const configProduction = new Config(dir, { TARGET_ENV: 'production' });

            expect(configLocal.get('production')).toBe(false);
            expect(configBeta.get('production')).toBe(false);
            expect(configProduction.get('production')).toBe(true);

        });

        test('sets production based on NODE_ENV when TARGET_ENV is not available', () => {

            const configLocal = new Config(dir, { NODE_ENV: 'development' });
            const configBeta = new Config(dir, { NODE_ENV: 'beta' });
            const configProduction = new Config(dir, { NODE_ENV: 'production' });

            expect(configLocal.get('production')).toBe(false);
            expect(configBeta.get('production')).toBe(false);
            expect(configProduction.get('production')).toBe(true);

        });

        test('sets development based on NODE_ENV', () => {

            const configDevelopment = new Config(dir, { NODE_ENV: 'development', TARGET_ENV: 'local' });
            const configProduction = new Config(dir, { NODE_ENV: 'production', TARGET_ENV: 'beta' });

            expect(configDevelopment.get('development')).toBe(true);
            expect(configProduction.get('production')).toBe(false);

        });

    });

});
