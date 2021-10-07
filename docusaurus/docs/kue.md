---
id: kue
title: '@idearium/kue'
---

A library to make working with Kue painless.

## Installation

```shell
$ yarn add -E @idearium/kue
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/kue@beta
```

## Usage

```JavaScript
const connect = require('@idearium/kue/create-queue');

connect();
```

## Configuration

This module must be provided a prefix used to isolate Redis entries. It can be configured as an environment variable `KUE_PREFIX=customprefix` or it can be provided as an options object:

```JavaScript
const connect = require('@idearium/kue/create-queue');

connect({ prefix: 'customprefix' });
```

You can also pass in an options object to further configure Kue. See [the Kue documentation](https://github.com/Automattic/kue) for configuration options.

## Redis

This package uses [@idearium/redis](https://idearium.github.io/idearium-lib/docs/redis). Follow the docs on how to configure and use it:

```JavaScript
const redis = require('@idearium/redis');
const connect = require('@idearium/kue/create-queue);

connect({ redis: { createClientFactory: () => redis({ host: 'remote.redis.instance', port: 6379 }) } });
```

## Logging

This package uses [@idearium/log](https://idearium.github.io/idearium-lib/docs/log). Follow the docs on how to configure it as required.
