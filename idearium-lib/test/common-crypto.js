'use strict';

const { expect } = require('chai');

let crypto;
const data = 'test';
const digest = 'Q7DO+ZJl+eNMEOqdNQGSbSezn1fG1nRWHYuiNueoGfs=';
const encryption = 'xhe0s7KlBwDw7Gi8riPy5A==';
const userIv = 'Oan9RRdKYuDCyzJI';
const userSecret = 'rmeJRgNBVizATHzG';

/**
 * Repeat tests a few times to ensure the functions are pure.
 */
describe('common/crypto', function () {

    /* eslint-disable global-require */
    before(function () {

        const config = require('../common/config');

        config.set('userIv', userIv);
        config.set('userSecret', userSecret);
        crypto = require('../common/crypto');

    });
    /* eslint-enable global-require */

    it('will decrypt some data', function () {

        expect(crypto.decrypt(encryption)).to.equal(data);
        expect(crypto.decrypt(encryption)).to.equal(data);
        expect(crypto.decrypt(encryption)).to.equal(data);

    });

    it('will create a hmac digest', function () {

        expect(crypto.digest(data)).to.equal(digest);
        expect(crypto.digest(data)).to.equal(digest);
        expect(crypto.digest(data)).to.equal(digest);

    });

    it('will encrypt some data', function () {

        expect(crypto.encrypt(data)).to.equal(encryption);
        expect(crypto.encrypt(data)).to.equal(encryption);
        expect(crypto.encrypt(data)).to.equal(encryption);

    });

    it('will generate an iv key pair', function () {

        expect(crypto.generateIvKey()).to.have.all.keys('iv', 'key');
        expect(crypto.generateIvKey()).to.have.all.keys('iv', 'key');
        expect(crypto.generateIvKey()).to.have.all.keys('iv', 'key');

    });

});
