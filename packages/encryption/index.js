'use strict';

const crypto = require('crypto');
const defaultAlgorithm = 'aes-256-ctr';

const required = (name = '') => {
    throw new Error(`Required parameter ${name} is missing.`);
};

const decrypt = ({
    algorithm = defaultAlgorithm,
    iv = required('iv'),
    key = required('key'),
    text = required('text')
} = {}) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
};

const encrypt = ({
    algorithm = defaultAlgorithm,
    iv = required('iv'),
    key = required('key'),
    text = required('text')
} = {}) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    return encrypted;
};

const atomic = ({
    algorithm = defaultAlgorithm,
    iv = required('iv'),
    key = required('key')
} = {}) => ({
    decrypt: ({ text }) => decrypt({ algorithm, iv, key, text }),
    encrypt: ({ text }) => encrypt({ algorithm, iv, key, text })
});

module.exports = {
    atomic,
    decrypt,
    encrypt
};
