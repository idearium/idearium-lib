---
id: log-http
title: '@idearium/log-http'
---

The Idearium HTTP JSON logger middleware. Uses [@idearium/log](log.md) and [pino-http](https://github.com/pinojs/pino-http) under the hood.

## Installation

```shell
$ yarn add @idearium/log-http
```

## Usage

```JavaScript
const express = require('express');
const logger = require('@idearium/log-http')();

const app = express();

app.use(logger);
```

The above produces the following log output:

```
{
      level: 30,
      severity: 'INFO',
      time: '2021-06-07T04:35:39.355Z',
      req: {
        headers: {
          'x-forwarded-for': '10.0.0.12',
          host: '127.0.0.1:58937',
          connection: 'close'
        },
        id: 1,
        method: 'GET',
        protocol: 'http/1.1',
        referer: '',
        remoteAddress: '127.0.0.1',
        remoteIp: '10.0.0.12',
        remotePort: 58938,
        size: 0,
        url: '/',
        userAgent: ''
      },
      res: { headers: {}, size: 11, statusCode: 200 },
      responseTime: 0,
      message: 'request completed'
    }
```

### Configuration

You can use an options object to customise how @idearium/log-http works. It extends the default configuration provided by [@idearium/log](log.md). Consult [@idearium/log](log.md#configuration) and [pino-http](https://github.com/pinojs/pino-http) for more configuration options.

#### Serializers

This package extends the standard serialisers provided by [pino-std-serializers](https://github.com/pinojs/pino-std-serializers) with the following additional information:

-   req
    -   protocol: The protocol (i.e. `http/1.1`).
    -   remoteIp: The IP of the client making the request.
-   res
    -   size: The response size.

## Entry points

There are a few entry points this package.

### `@idearium/log-http`

This is the primary entry point and is intended to be used as middleware with Node.js.

### `@idearium/log-http/defaults`

These are the defaults used by the package.

## Formatters

This package extends what [pino-http](https://github.com/pinojs/pino-http) provides out of the box, however, it does not reshape the logs as required by [GCP Structured Logging](https://cloud.google.com/logging/docs/structured-logging).

You can use [@idearium/log-structured](log-structured) to take input from this package and reshape the log to include the `httpRequest` property.
