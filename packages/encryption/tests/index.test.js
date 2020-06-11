'use strict';

const crypto = require('crypto');
const { atomic, decrypt, encrypt } = require('../');

describe('atomic', () => {
    test('is a function', () => {
        expect(typeof atomic).toBe('function');
    });

    test('will throw unless provided the iv argument', () => {
        expect(atomic).toThrow(/^Required parameter iv is missing\.$/);
    });

    test('will throw unless provided the key argument', () => {
        expect(() => atomic({ iv: 'iv' })).toThrow(
            /^Required parameter key is missing\.$/
        );
    });

    test('generates an object with functions', () => {
        const o = atomic({ iv: 'iv', key: 'key' });

        expect(typeof o).toBe('object');
        expect(o).toHaveProperty('encrypt');
        expect(o).toHaveProperty('decrypt');

        expect(typeof o.encrypt).toBe('function');
        expect(typeof o.decrypt).toBe('function');
    });

    test('generates an object with functions that will encrypt and decrypt', () => {
        const o = atomic({
            iv: '6iz68yjtmVj&r7$H',
            key: 'AsRdgU=cwnu8BCXNpgV2gAQk8XL;4oTW'
        });
        const { decrypt: decryptText, encrypt: encryptText } = o;

        expect(typeof o).toBe('object');
        expect(o).toHaveProperty('encrypt');
        expect(o).toHaveProperty('decrypt');

        expect(typeof o.encrypt).toBe('function');
        expect(typeof o.decrypt).toBe('function');

        expect(encryptText({ text: 'another message' })).toBe(
            '70ec0acdcdb4e633384fd599899f50'
        );
        expect(decryptText({ text: '70ec0acdcdb4e633384fd599899f50' })).toBe(
            'another message'
        );
    });

    test('works with aes-256-cbc', () => {
        const o = atomic({
            algorithm: 'aes-256-cbc',
            iv: 'y93dBvVRx6=ou>4j',
            key: '2W)x2ynLcamjP9m8FEAPJhJkDMLC+HpN'
        });
        const { decrypt: decryptText, encrypt: encryptText } = o;
        const plainText = 'aes-256-cbc test';
        const encryptedText =
            '8468db2624c558d3c32d35db6cb37f3d3b557d4eaaca2713386e40aef229c113';

        expect(encryptText({ text: plainText })).toBe(encryptedText);
        expect(decryptText({ text: encryptedText })).toBe(plainText);
    });

    test('works with des', () => {
        const o = atomic({
            algorithm: 'des-ede3-cbc',
            iv: '2G2}b6+9',
            key: 'xMEh4evD8pnsN3Ypxg}EJv2Q'
        });
        const { decrypt: decryptText, encrypt: encryptText } = o;
        const plainText = 'des test';
        const encryptedText = '16c1f00eaa5a0771db81996c0db41980';

        expect(encryptText({ text: plainText })).toBe(encryptedText);
        expect(decryptText({ text: encryptedText })).toBe(plainText);
    });

    test('works with rc4', () => {
        const o = atomic({
            algorithm: 'rc4',
            iv: null,
            key: 'Z4nDPfxKjPGGCqA2wVKjMMB{nyL^ytWNbWyzLg4xbvxX6ioxvxRw'
        });
        const { decrypt: decryptText, encrypt: encryptText } = o;
        const plainText = 'rc4 test';
        const encryptedText = 'e67f340c0670f4c7';

        expect(encryptText({ text: plainText })).toBe(encryptedText);
        expect(decryptText({ text: encryptedText })).toBe(plainText);
    });
});

describe('decrypt', () => {
    test('is a function', () => {
        expect(typeof decrypt).toBe('function');
    });

    test('will throw unless provided the iv argument', () => {
        expect(decrypt).toThrow(/^Required parameter iv is missing\.$/);
    });

    test('will throw unless provided the key argument', () => {
        expect(() => decrypt({ iv: 'iv' })).toThrow(
            /^Required parameter key is missing\.$/
        );
    });

    test('will throw unless provided the text argument', () => {
        expect(() => decrypt({ iv: 'iv', key: 'key' })).toThrow(
            /^Required parameter text is missing\.$/
        );
    });

    test('will decrypt encrypted text', () => {
        const iv = 'b]7rDTw3BF2N6&vH';
        const key = 'dEDZvjbh)ADz3KzjpWW9TQL7(nfuyz2Q';

        expect(
            decrypt({
                iv,
                key,
                text: 'a7f7dfba7dcd78f3acef'
            })
        ).toBe('plain text');
    });

    test('will throw unless provided the correct iv and key lengths', () => {
        expect(() =>
            decrypt({
                iv: 'A',
                key: 'B',
                text: ''
            })
        ).toThrow(/Invalid IV length/);
        expect(() =>
            decrypt({
                iv: crypto.randomBytes(16),
                key: 'BC',
                text: ''
            })
        ).toThrow(/Invalid key length/);
    });
});

describe('encrypt', () => {
    test('is a function', () => {
        expect(typeof encrypt).toBe('function');
    });

    test('will throw unless provided the iv argument', () => {
        expect(encrypt).toThrow(/^Required parameter iv is missing\.$/);
    });

    test('will throw unless provided the key argument', () => {
        expect(() => encrypt({ iv: 'iv' })).toThrow(
            /^Required parameter key is missing\.$/
        );
    });

    test('will throw unless provided the text argument', () => {
        expect(() => encrypt({ iv: 'iv', key: 'key' })).toThrow(
            /^Required parameter text is missing\.$/
        );
    });

    test('will encrypt plain text', () => {
        const iv = 'b]7rDTw3BF2N6&vH';
        const key = 'dEDZvjbh)ADz3KzjpWW9TQL7(nfuyz2Q';

        expect(
            encrypt({
                iv,
                key,
                text: 'plain text'
            })
        ).toBe('a7f7dfba7dcd78f3acef');
    });

    test('will throw unless provided the correct iv and key lengths', () => {
        expect(() =>
            encrypt({
                iv: 'A',
                key: 'B',
                text: 'plain text'
            })
        ).toThrow(/Invalid IV length/);
        expect(() =>
            encrypt({
                iv: crypto.randomBytes(16),
                key: 'BC',
                text: 'plain text'
            })
        ).toThrow(/Invalid key length/);
    });
});
