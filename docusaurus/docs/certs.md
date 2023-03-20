---
id: certs
title: '@idearium/certs'
---

Easily load custom and OS certificate authority certs into Node.js.

## Installation

```shell
$ yarn add -E @idearium/certs
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/certs@beta
```

## Usage

### `loadCerts`

Use the `loadCerts` function to load multiple certificates and keys from a directory structure.

Given the following directory structure:

```
/ssl/amqp.crt
/ssl/amqp.key
/ssl/redis.crt
/ssl/redis.key
/ssl/ca/ca.crt
```

`loadCerts` will return the following:

```JavaScript
{
    ca: [ 'ca.crt content' ],
    certs: {
        amqp: { crt: 'amqp.crt content', key: 'amqp.key content' },
        redis: { crt: 'redis.crt content', key: 'redis.key content' }
    }
}
```

By default, it will look for custom certs in the `/ssl` directory but this can easily be changed:

```JavaScript
const { loadCerts } = require('@idearium/certs');

await loadCerts('/certs');
```

#### Requirements

`loadCerts` has the following expectations:

-   It will load CA certs in the `ca` directory, relative to the directory provided to it. If the directory doesn't exist, it will ignored.
-   It will only load files with `.crt` and `.key` extensions.

### `loadOsCerts`

Use the `loadOsCerts` function to OS provided certs:

```JavaScript
const { loadOsCerts } = require('@idearium/certs');

await loadOsCerts();
```
