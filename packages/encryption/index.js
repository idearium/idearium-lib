'use strict';

const crypto = require('crypto');
const defaultAlgorithm = 'aes-256-ctr';

const required = (name = '') => {
    throw new Error(`Required parameter ${name} is missing.`);
};

const decrypt = ({
    algorithm = defaultAlgorithm,
    inputEncoding = 'hex',
    iv = required('iv'),
    key = required('key'),
    outputEncoding = 'utf8',
    text = required('text')
} = {}) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text, inputEncoding, outputEncoding);

    decrypted += decipher.final(outputEncoding);

    return decrypted;
};

const encrypt = ({
    algorithm = defaultAlgorithm,
    inputEncoding = 'utf8',
    iv = required('iv'),
    key = required('key'),
    outputEncoding = 'hex',
    text = required('text')
} = {}) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, inputEncoding, outputEncoding);

    encrypted += cipher.final(outputEncoding);

    return encrypted;
};

const atomic = ({
    algorithm = defaultAlgorithm,
    decryptInputEncoding = 'hex',
    decryptOutputEncoding = 'utf8',
    encryptInputEncoding = 'utf8',
    encryptOutputEncoding = 'hex',
    iv = required('iv'),
    key = required('key')
} = {}) => ({
    decrypt: ({ text }) =>
        decrypt({
            algorithm,
            inputEncoding: decryptInputEncoding,
            iv,
            key,
            outputEncoding: decryptOutputEncoding,
            text
        }),
    encrypt: ({ text }) =>
        encrypt({
            algorithm,
            inputEncoding: encryptInputEncoding,
            iv,
            key,
            outputEncoding: encryptOutputEncoding,
            text
        })
});

module.exports = {
    atomic,
    decrypt,
    encrypt
};
