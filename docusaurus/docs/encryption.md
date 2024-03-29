---
id: encryption
title: '@idearium/encryption'
---

A library to make encrypting and decrypting plain text in Node.js painless.

## Installation

```shell
$ yarn add -E @idearium/encryption
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/encryption@beta
```

## Usage

To use `@idearium/encryption`, follow these steps:

-   [Create a library file.](#create-a-library-file)
-   [Use the library file within your app.](#use-the-library-file)

### Create a library file

Start by creating a library file which you'll export the functions generated by `atomic` and use these within your application.

```JavaScript
// lib/encryption.js

import { atomic } from '@idearium/encryption';

const iv = '6iz68yjtmVj&r7$H';
const key = 'AsRdgU=cwnu8BCXNpgV2gAQk8XL;4oTW';

export const {decrypt, encrypt} = atomic({ iv, key });

```

### Use the library file

Now you can use the library file you've created to actually encrypt and decrypt information in your app.

```JavaScript
// another-file.js

import assert from 'assert';
import {decrypt, encrypt} from './lib/encryption.js';

const text = 'Some text;
const encrypted = encrypt({ text });
const decrypted = decrypt({ text: encrypted });

const matches = assert.equal(text, decrypted);
```

## Advanced usage

This library also allows you to do the following:

-   Change the encryption algorithm.
-   Directly use the `encrypt` and `decrypt` functions exported by the library.
-   Change the input and output encoding types.

### Encryption algorithms

By default, this library uses the `aes-256-ctr` algorithm. However, you can use any encryption algorithm supported by Node.js:

```JavaScript
// lib/encryption.js

import { atomic } from '@idearium/encryption';

const algorithm = 'aes-256-cbc';
const iv = '6iz68yjtmVj&r7$H';
const key = 'AsRdgU=cwnu8BCXNpgV2gAQk8XL;4oTW';

export const {decrypt, encrypt} = atomic({ algorithm, iv, key });

```

Some algorithm's such as `rc4` don't require an IV, in which case you can pass `null`:

```JavaScript

export default atomic({
    algorithm: 'rc4',
    iv: null,
    key: 'Z4nDPfxKjPGGCqA2wVKjMMB{nyL^ytWNbWyzLg4xbvxX6ioxvxRw'
});

```

## Use `decrypt` and `encrypt` directly

The examples above show how to use the library with `atomic` which returns an object with keys `decrypt` and `encrypt`. These keys contain functions which are bound to the same `algorithm`, `iv` and `key` values provided to `atomic`. This makes it easy to encrypt and decrypt using the same settings.

However, there are some instances in which you might only want to encrypt or decrypt some text (for example, encrypting a value to send to a third party). In this instance you can use the `decrypt` and `encrypt` functions exported by the library:

```JavaScript

import { encrypt } from `@idearium/encryption`;

export default ({ algorithm = 'rc4',
    iv = null,
    key = 'Z4nDPfxKjPGGCqA2wVKjMMB{nyL^ytWNbWyzLg4xbvxX6ioxvxRw' } = {}) =>
        encrypt({ algorithm, iv, key });

```

## Change the input and output encoding types

The input and output encoding types can also be changed, you might need this if you want to integrate with an existing library that has it's own crypto functions.

```js
export default atomic({
    ...
    decryptInputEncoding: 'hex',
    decryptOutputEncoding: 'utf8',
    encryptInputEncoding: 'utf8',
    encryptOutputEncoding: 'hex',
});

// or

export default decrypt({
    ...
    inputEncoding: 'hex',
    outputEncoding: 'utf8',
});

export default encrypt({
    ...
    inputEncoding: 'utf8',
    outputEncoding: 'hex',
});
```
