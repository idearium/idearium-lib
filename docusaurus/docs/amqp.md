---
id: amqp
title: '@idearium/amqp'
---

Explicitly connect to an AMQP server and then publish and consume messages.

## Installation

```shell
$ yarn add -E @idearium/amqp
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/amqp@beta
```

## Usage

To use `@idearium/amqp`, you'll need to:

-   Connect to an AMQP server.
-   Setup consumers.
-   Publish messages.

### Connect to an AMQP server

Use the following to create a connection to an AMQP server.

```JavaScript
const amqp = require('@idearium/amqp');

await amqp.connect('amqps://localhost:5671')
```

### Setup consumers

Start by setting up consumers so that messages will be processed:

```JavaScript
const amqp = require('@idearium/amqp');

amqp.consume(
    'consumer-name',
    async (data) => {
        console.log('Consuming data', data);

        return true;
    },
    {
        exchange: 'ampq-test',
        queue: 'ampq-test',
        routingKey: 'ampq-test',
    }
)
```

### Publish messages

Now you can start publishing messages:

```JavaScript
const amqp = require('@idearium/amqp');

amqp.publish('test-b', { test: true }, {
    exchange: 'ampq-test',
    routingKey: 'ampq-test',
    persistent: true,
});
```

## Examples

### Certificates

This example shows how to load certificates and pass it to `connect` to allow making secured connections.

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

const createConnection = async () => {
    const opts = await certs(`${process.cwd()}/amqp-certs`);

    return client.connect(
        'amqps://localhost:5671',
        opts
    );
};

module.exports = async (opts = {}) => {
    await createConnection();

    // Setup consumers
    // Publish messages
};
```
