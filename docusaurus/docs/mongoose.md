---
id: mongoose
title: '@idearium/mongoose'
---

Mongoose connection defaults.

## Installation

**Please note**: mongoose is a peer dependency so you'll need to add it specifically to your project.

```shell
$ yarn add -E mongoose@4.11 @idearium/mongoose
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E mongoose@4.11 @idearium/mongoose@beta
```

## Usage

```JavaScript
const mongoose = require('mongoose');
const { connect } = require('@idearium/mongoose');

connect({ mongoose, uri: process.env.MONGO_DB_URL, options: { ssl: process.env.MONGO_DB_SSL === 'true' } })
    .then(() => console.log('Mongoose connected to MongoDB...'))
```

The following are the default options:

```
{
    reconnectInterval: 500,
    reconnectTries: Number.MAX_VALUE,
    sslValidate: Boolean(opts.ssl || opts.tls),
    useMongoClient: true
}
```

These can be replaced by adding your own values in an `options` object.

#### `connect({ mongoose, options = {}, uri })`

The `connect` function is used to connect Mongoose to MongoDB.

#### `createConnections({ mongoose, options = {}, uris })`

The `createConnections` function uses `mongoose.createConnection` to connect Mongoose to multiple databases.

Use `uris` to pass in an array of MongoDB connection strings.

## Logging

This package uses [@idearium/log](https://idearium.github.io/idearium-lib/docs/log). Follow the docs on how to configure it as required.
