---
id: redis
title: '@idearium/redis'
---

Redis connection defaults.

## Installation

```shell
$ yarn add -E @idearium/redis
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/redis@beta
```

## Usage

The following will always return a new Redis connection.

```JavaScript
const redis = require('@idearium/redis');

const connection = redis();
```

To return an existing redis connection:

```JavaScript
const existingConnection = redis({ reuse: true });
```

This module relies on the following environment variables:

-   `CACHE_URL` which should be a Redis connection string.

## Configuration

This module can be configured with the following optional environment variables:

-   `REDIS_RETRY_DELAY` which defaults to `2000`.
-   `REDIS_RETRY_LIMIT` which defaults to `10`.

You can also pass in an options object to further configure ioredis. See [the ioredis documentation](https://github.com/luin/ioredis) for configuration options.

## Examples

### Self-signed certificates

This example shows how to use [@idearium/certs](/idearium-lib/docs/certs) to load a self-signed certificate and pass it to `redis` to allow making secure connections to Redis instances protected with self-signed certificates.

```JavaScript
const redis = require('@idearium/redis');
const { loadProvidedCerts } = require('@idearium/certs');

module.exports = async () => {

    const certs = await loadProvidedCerts('/ssl/redis');
    const opts = certs.length ? { tls: { ca: certs } } : {};

    return redis(opts);

}
```

## Logging

This package uses [@idearium/log](https://idearium.github.io/idearium-lib/docs/log). Follow the docs on how to configure it as required.
