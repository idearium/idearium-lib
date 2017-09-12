'use strict';

const config = require('./config');
const crypto = require('crypto');

/**
 * Decrypt some data.
 * @param {Buffer} data Data to decrypt.
 * @param {Object} options Cipher options.
 * @param {String} [options.algorithm='aes-128-cbc'] Cipher algorithm.
 * @param {String} [options.inputEncoding='utf8'] Cipher input encoding.
 * @param {String} [options.iv=config.get('userIv')] Cipher initialization vector.
 * @param {String} [options.key=config.get('userSecret')] Cipher key.
 * @param {String} [options.outputEncoding='base64'] Cipher output encoding.
 * @return {String} Decrypted data.
 */
const decrypt = (data, options) => {

    const settings = Object.assign({
        algorithm: 'aes-128-cbc',
        inputEncoding: 'utf8',
        iv: config.get('userIv'),
        key: config.get('userSecret'),
        outputEncoding: 'base64',
    }, options);
    const { algorithm, inputEncoding, iv, key, outputEncoding } = settings;

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(data, outputEncoding, inputEncoding);

    decrypted += decipher.final(inputEncoding);

    return decrypted;

};

/**
 * Create a hmac digest.
 * @param {Buffer} data Data to digest.
 * @param {Object} options Hmac options.
 * @param {String} [options.algorithm='sha256'] Hmac algorithm.
 * @param {String} [options.encoding='base64'] Hmac encoding.
 * @param {String} [options.inputEncoding='utf8'] Hmac input encoding.
 * @param {String} [options.key=''] Hmac key.
 * @return {Promise} Hmac string.
 */
const digest = (data, options) => {

    const settings = Object.assign({
        algorithm: 'sha256',
        encoding: 'base64',
        inputEncoding: 'utf8',
        key: '',
    }, options);
    const { algorithm, encoding, inputEncoding, key } = settings;

    const hmac = crypto.createHmac(algorithm, key);

    hmac.update(data);

    return hmac.digest(encoding, inputEncoding);

};

/**
 * Encrypt some data.
 * @param {Buffer} data Data to encrypt.
 * @param {Object} options Cipher options.
 * @param {String} [options.algorithm='aes-128-cbc'] Cipher algorithm.
 * @param {String} [options.inputEncoding='utf8'] Cipher input encoding.
 * @param {String} [options.iv=config.get('userIv')] Cipher initialization vector.
 * @param {String} [options.key=config.get('userSecret')] Cipher key.
 * @param {String} [options.outputEncoding='base64'] Cipher output encoding.
 * @return {String} Encrypted data.
 */
const encrypt = (data, options) => {

    const settings = Object.assign({
        algorithm: 'aes-128-cbc',
        inputEncoding: 'utf8',
        iv: config.get('userIv'),
        key: config.get('userSecret'),
        outputEncoding: 'base64',
    }, options);
    const { algorithm, inputEncoding, iv, key, outputEncoding } = settings;

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, inputEncoding, outputEncoding);

    encrypted += cipher.final(outputEncoding);

    return encrypted;

};

/**
 * Generate an encryption initialization vector and key.
 * @param {Object} options Key options.
 * @param {String} options.encoding Encoding of the keys.
 * @param {Number} options.length Length of the keys.
 * @return {Object} Object containing the iv and key.
 */
const generateIvKey = (options) => {

    const settings = Object.assign({
        encoding: 'base64',
        length: 16,
    }, options);
    const { encoding, length } = settings;

    const iv = digest(crypto.randomBytes(length))
        .toString(encoding)
        .slice(0, length);

    const key = digest(crypto.randomBytes(length))
        .toString(encoding)
        .slice(0, length);

    return { iv, key };

};

module.exports = { decrypt, digest, encrypt, generateIvKey };
