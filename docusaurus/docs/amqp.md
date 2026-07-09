---
id: amqp
title: '@idearium/amqp'
---

Explicitly connect to an AMQP server and then publish and consume messages.

## Installation

```shell
$ npm install -E @idearium/amqp
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ npm install -E @idearium/amqp@beta
```

## Usage

`@idearium/amqp` exports a factory `amqp(mqUrl, opts)` that connects to the
broker and returns `{ consume, publish }`. Call it once at startup, then use the
returned `client` to set up consumers and publish messages.

- Connect to an AMQP server.
- Setup consumers.
- Publish messages.

### Connect to an AMQP server

Call the factory with the broker URL and an optional `opts` object. It resolves
to a `client` exposing `consume` and `publish`.

```JavaScript
const amqp = require('@idearium/amqp');

const client = await amqp('amqps://localhost:5671/', { exitOnClose: false });
```

`exitOnClose` defaults to `false`, meaning a broker disconnect **does not** crash
the process — `isConnected()` flips to `false` so subsequent calls surface a
clear error. This is the right default for long-running API servers. Set
`exitOnClose: true` for short-lived workers that rely on a process supervisor to
restart them on broker failure (the close handler throws, surfacing as an
unhandled rejection that terminates the process under Node's default
`--unhandled-rejections=throw` policy).

### Setup consumers

Start by setting up consumers so that messages will be processed:

```JavaScript
const amqp = require('@idearium/amqp');

const client = await amqp('amqps://localhost:5671/');

await client.consume(
    'consumer-name',
    async (data) => {
        console.log('Consuming data', data);

        return true;
    },
    {
        exchange: 'amqp-test',
        queue: 'amqp-test',
        routingKey: 'amqp-test',
    }
);
```

### Publish messages

Now you can start publishing messages:

```JavaScript
const amqp = require('@idearium/amqp');

const client = await amqp('amqps://localhost:5671/');

await client.publish(
    'test-b',
    { test: true },
    {
        exchange: 'amqp-test',
        routingKey: 'amqp-test',
        persistent: true,
    }
);
```

## Examples

### Certificates

This example shows how to load certificates and pass them to the factory to make
secured connections.

```JavaScript
// lib/certs.js

const fs = require('fs/promises');
const { join } = require('path');
const promiseAllSettled = require('@idearium/promise-all-settled');

const loadFile = async (path) => fs.readFile(path, 'utf-8');

const readDir = async (path) => fs.readdir(path);

module.exports = async (dir) => {
    const content = await readDir(dir);

    const certs = {};

    const certPath = content.find((path) => /\.ce?rt$/.test(path));
    const keyPath = content.find((path) => /\.key$/.test(path));

    if (certPath) {
        certs.crt = await loadFile(join(dir, certPath));
    }

    if (keyPath) {
        certs.key = await loadFile(join(dir, keyPath));
    }

    if (content.includes('ca')) {
        [, certs.ca] = await promiseAllSettled(
            (await readDir(join(dir, 'ca')))
                .filter((path) => /\.ce?rt$/.test(path))
                .map((path) => loadFile(join(dir, 'ca', path)))
        );
    }

    return certs;
};

```

```JavaScript
const amqp = require('@idearium/amqp');
const certs = require('./lib/certs');

module.exports = async () => {
    const opts = await certs(`${process.cwd()}/amqp-certs`);

    const client = await amqp('amqps://localhost:5671', opts);

    // Setup consumers
    // Publish messages

    return client;
};
```
