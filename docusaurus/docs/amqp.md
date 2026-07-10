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

`@idearium/amqp` is an ESM-only package. It exports `createClient`,
`createConsumer`, and `createPublisher`. Call `createClient` once at startup to
connect and get back a `client` with `consume` and `publish` methods.

- Connect to an AMQP server.
- Setup consumers.
- Publish messages.

### Connect to an AMQP server

Call `createClient` with a broker URL (or omit `mqUrl` to fall back to
`process.env.MQ_URL`). It resolves to a `client` exposing `consume`, `publish`,
`session`, and `stop`.

```JavaScript
import { createClient } from '@idearium/amqp';

const client = await createClient({ mqUrl: 'amqps://localhost:5671/' });
```

The underlying `AMQPSession` handles automatic reconnection and consumer
recovery. If reconnection attempts are exhausted, the `onfailed` lifecycle hook
logs the error. Call `client.stop(reason)` to cleanly close the connection and
cancel reconnection.

### Setup consumers

Start by setting up consumers so that messages will be processed:

```JavaScript
import { createClient } from '@idearium/amqp';

const client = await createClient({ mqUrl: 'amqps://localhost:5671/' });

await client.consume({
    consumer: async (data) => {
        console.log('Consuming data', data);
    },
    exchange: 'amqp-test',
    name: 'consumer-name',
    queue: 'amqp-test',
    routingKey: 'amqp-test',
});
```

`consume` accepts a single object with `consumer`, `exchange`, `name`, `queue`,
and `routingKey` (required), plus optional `durable` (default `true`), `noAck`
(default `false`), and `type` (default `'topic'`). Messages are published as
persistent by default and deserialized automatically via the built-in JSON codec.
The `consumer` callback always receives `data` as an array — a single message is
wrapped as `[data]`.

### Publish messages

Now you can start publishing messages:

```JavaScript
import { createClient } from '@idearium/amqp';

const client = await createClient({ mqUrl: 'amqps://localhost:5671/' });

await client.publish({
    data: { test: true },
    exchange: 'amqp-test',
    routingKey: 'amqp-test',
});
```

`publish` accepts a single object with `data`, `exchange`, and `routingKey`
(required), plus optional `durable` (default `true`) and `type` (default
`'topic'`). Messages are persistent (`deliveryMode: 2`) by default.

## Examples

### Certificates

This example shows how to load certificates and pass them as `tlsOptions` to
make secured connections.

```JavaScript
// lib/certs.js
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

const loadFile = async (path) => readFile(path, 'utf-8');

const readDir = async (path) => readdir(path);

export const loadCerts = async (dir) => {
    const content = await readDir(dir);

    const tlsOptions = {};

    const certPath = content.find((path) => /\.ce?rt$/.test(path));
    const keyPath = content.find((path) => /\.key$/.test(path));

    if (certPath) {
        tlsOptions.cert = await loadFile(join(dir, certPath));
    }

    if (keyPath) {
        tlsOptions.key = await loadFile(join(dir, keyPath));
    }

    if (content.includes('ca')) {
        const caFiles = (await readDir(join(dir, 'ca')))
            .filter((path) => /\.ce?rt$/.test(path));

        const results = await Promise.allSettled(
            caFiles.map((path) => loadFile(join(dir, 'ca', path))),
        );

        tlsOptions.ca = results
            .filter(({ status }) => status === 'fulfilled')
            .map(({ value }) => value);
    }

    return tlsOptions;
};
```

```JavaScript
// index.js
import { createClient } from '@idearium/amqp';

import { loadCerts } from './lib/certs.js';

export default async () => {
    const tlsOptions = await loadCerts(`${process.cwd()}/amqp-certs`);

    const client = await createClient({
        mqUrl: 'amqps://localhost:5671/',
        tlsOptions,
    });

    // Setup consumers
    // Publish messages

    return client;
};
```
