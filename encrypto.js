// This is example of using crypto.createCipheriv(), because
// crypto.createCipher() is deprecated since Node.js v10

const crypto = require('crypto');

const encrypto = {
    encrypt(text, key, iv) {
        // const key = password.repeat(32).substr(0, 32);
        // const iv = password.repeat(16).substr(0, 16);
        // console.log('key', key, 'iv', iv);
        const cipher = crypto.createCipheriv('rc4', key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    },

    decrypt(text, key, iv) {
        // const key = password.repeat(32).substr(0, 32);
        // const iv = password.repeat(16).substr(0, 16);
        const decipher = crypto.createDecipheriv('rc4', key, iv);
        let decrypted = decipher.update(text, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
};

const message = 'rc4 test';

const key = 'Z4nDPfxKjPGGCqA2wVKjMMB{nyL^ytWNbWyzLg4xbvxX6ioxvxRw';

const iv = null;

const encryptedMessage = encrypto.encrypt(message, key, iv);

console.log(encryptedMessage); //  17a26aa419b4b88609750b9f

console.log(encrypto.decrypt(encryptedMessage, key, iv)); // Hello World!
