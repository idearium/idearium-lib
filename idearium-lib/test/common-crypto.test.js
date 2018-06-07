'use strict';

jest.mock('/app/config/config.js', () => ({
    userIv: 'Oan9RRdKYuDCyzJI',
    userSecret: 'rmeJRgNBVizATHzG',
}));

const crypto = require('../common/crypto');

const data = 'test';
const digest = 'Q7DO+ZJl+eNMEOqdNQGSbSezn1fG1nRWHYuiNueoGfs=';
const encryption = 'xhe0s7KlBwDw7Gi8riPy5A==';

/**
 * Repeat tests a few times to ensure the functions are pure.
 */
describe('common/crypto', () => {

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
