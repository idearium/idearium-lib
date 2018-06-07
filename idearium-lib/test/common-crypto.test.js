'use strict';

const { makeConfigs } = require('./util');

let crypto;
const data = 'test';
const digest = 'Q7DO+ZJl+eNMEOqdNQGSbSezn1fG1nRWHYuiNueoGfs=';
const encryption = 'xhe0s7KlBwDw7Gi8riPy5A==';
const userIv = 'Oan9RRdKYuDCyzJI';
const userSecret = 'rmeJRgNBVizATHzG';

/**
 * Repeat tests a few times to ensure the functions are pure.
 */
describe('common/crypto', () => {

    /* eslint-disable global-require */
    beforeAll(() => makeConfigs()
        .then(() => {

            const config = require('../common/config');

            config.set('userIv', userIv);
            config.set('userSecret', userSecret);
            crypto = require('../common/crypto');

        }));
    /* eslint-enable global-require */

    it('will decrypt some data', () => {

        expect(crypto.decrypt(encryption)).toBe(data);
        expect(crypto.decrypt(encryption)).toBe(data);
        expect(crypto.decrypt(encryption)).toBe(data);

    });

    it('will create a hmac digest', () => {

        expect(crypto.digest(data)).toBe(digest);
        expect(crypto.digest(data)).toBe(digest);
        expect(crypto.digest(data)).toBe(digest);

    });

    it('will encrypt some data', () => {

        expect(crypto.encrypt(data)).toBe(encryption);
        expect(crypto.encrypt(data)).toBe(encryption);
        expect(crypto.encrypt(data)).toBe(encryption);

    });

    it('will generate an iv key pair', () => {

        expect(Object.keys(crypto.generateIvKey()).sort()).toEqual(['iv', 'key']);
        expect(Object.keys(crypto.generateIvKey()).sort()).toEqual(['iv', 'key']);
        expect(Object.keys(crypto.generateIvKey()).sort()).toEqual(['iv', 'key']);

    });

});
