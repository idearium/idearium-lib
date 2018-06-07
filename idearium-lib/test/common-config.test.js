'use strict';

jest.mock('/app/config/config.js', () => ({
    phone: 1234,
    title: 'development',
}));

const config = require('../common/config');

describe('common/config', () => {

    it('will load the config', () => {

        expect(config.get('title')).toBe('development');
        expect(config.get('phone')).toBe(1234);

        config.set('url', 'google.com');
        expect(config.get('url')).toBe('google.com');

    });

});
