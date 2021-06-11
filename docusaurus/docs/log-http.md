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

```JSON
{
  "level": 30,
  "severity": "INFO",
  "time": "2021-06-07T04:35:39.355Z",
  "req": {
    "headers": {
      "x-forwarded-for": "10.0.0.12",
      "host": "127.0.0.1:58937",
      "connection": "close"
    },
    "id": 1,
    "method": "GET",
    "protocol": "http/1.1",
    "referer": "",
    "remoteAddress": "127.0.0.1",
    "remoteIp": "10.0.0.12",
    "remotePort": 58938,
    "size": 0,
    "url": "/",
    "userAgent": ""
  },
  "res": { "headers": {}, "size": 11, "statusCode": 200 },
  "responseTime": 0,
  "message": "request completed"
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

## Error logging

There is a little more effort require to properly log `next(new Error()))` style errors that occur during the request response lifecycle.

It involves using the `@idearium/log-http/error-middleware` entry point (which is middleware) and add this as the first error middleware (after all non-error middleware).

```JavaScript
const express = require('express');
const logger = require('@idearium/log-http')();
const errorMiddleware = require('@idearium/log-http/error-middleware')();

const app = express();

app.use(logger);

// Other routes here
app.get('/', (req, res) => res.send('Hello world'));

// Generate errors in routes with:
app.get('/error', (req, res, next) => next(new Error('Testing errors...')));

// Put the error middleware last
app.use(errorMiddleware);
```

The above produces the following log output when a request errors:

```JSON
{
  "level": 30,
  "severity": "INFO",
  "time": "2021-06-11T01:57:31.740Z",
  "req": {
    "headers": { "host": "127.0.0.1:51491", "connection": "close" },
    "id": 1,
    "method": "GET",
    "protocol": "http/1.1",
    "remoteAddress": "127.0.0.1",
    "remoteIp": "127.0.0.1",
    "remotePort": 51492,
    "url": "/error"
  },
  "res": {
    "headers": {
      "x-powered-by": "Express",
      "content-security-policy": "default-src 'none'",
      "x-content-type-options": "nosniff",
      "content-type": "text/html; charset=utf-8",
      "content-length": 1413
    },
    "size": 1413,
    "statusCode": 500
  },
  "err": {
    "@type": "type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent",
    "message": "Error: Testing errors...\n    at app.get (/Developer/idearium-lib/packages/log-http/tests/index.test.js:61:18)\n    at Layer.handle [as handle_request] (/Developer/idearium-lib/node_modules/express/lib/router/layer.js:95:5)\n    at next (/Developer/idearium-lib/node_modules/express/lib/router/route.js:137:13)\n    at Route.dispatch (/Developer/idearium-lib/node_modules/express/lib/router/route.js:112:3)\n    at Layer.handle [as handle_request] (/Developer/idearium-lib/node_modules/express/lib/router/layer.js:95:5)\n    at /idearium-lib/node_modules/express/lib/router/index.js:281:22\n    at Function.process_params (/Developer/idearium-lib/node_modules/express/lib/router/index.js:335:12)\n    at next (/Developer/idearium-lib/node_modules/express/lib/router/index.js:275:10)\n    at loggingMiddleware (/Developer/idearium-lib/node_modules/pino-http/logger.js:131:7)\n    at Layer.handle [as handle_request] (/Developer/idearium-lib/node_modules/express/lib/router/layer.js:95:5)"
  },
  "responseTime": 3,
  "message": "request errored"
}
```

### Error context

You can also provide additional context with errors which will be logged with the error itself.

```JavaScript
(req, res, next) => {

    const err = new Error('Error with context');

    err.context = { code: 123 };

    return next(err);

}
```

This will produce the following `err` on the log:

```JSON
{
  "err": {
    "@type": "type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent",
    "message": "Error: Testing errors...\n    at app.get (/Developer/idearium-lib/packages/log-http/tests/index.test.js:65:25)\n    at Layer.handle [as handle_request] (/Developer/idearium-lib/node_modules/express/lib/router/layer.js:95:5)\n    at next (/Developer/idearium-lib/node_modules/express/lib/router/route.js:137:13)\n    at Route.dispatch (/Developer/idearium-lib/node_modules/express/lib/router/route.js:112:3)\n    at Layer.handle [as handle_request] (/Developer/idearium-lib/node_modules/express/lib/router/layer.js:95:5)\n    at /idearium-lib/node_modules/express/lib/router/index.js:281:22\n    at Function.process_params (/Developer/idearium-lib/node_modules/express/lib/router/index.js:335:12)\n    at next (/Developer/idearium-lib/node_modules/express/lib/router/index.js:275:10)\n    at loggingMiddleware (/Developer/idearium-lib/node_modules/pino-http/logger.js:131:7)\n    at Layer.handle [as handle_request] (/Developer/idearium-lib/node_modules/express/lib/router/layer.js:95:5)",
    "context": { "code": 123 }
  }
}

```

## Entry points

There are a few entry points this package. These entry points can be used as required and are useful for using the existing defaults as a starting point and then customising further as required.

### `@idearium/log-http`

This is the primary entry point and is intended to be used as middleware with Node.js.

### `@idearium/log-http/defaults`

These are the defaults used by the package.

### `@idearium/log-http/err`

This is the `err` serializer.

### `@idearium/log-http/req`

This is the `req` serializer.

### `@idearium/log-http/res`

This is the `res` serializer.

### `@idearium/log-http/error-middleware`

This is the error handling middleware that you can use with Express.

## Formatters

This package extends what [pino-http](https://github.com/pinojs/pino-http) provides out of the box, however, it does not reshape the logs as required by [GCP Structured Logging](https://cloud.google.com/logging/docs/structured-logging).

You can use [@idearium/log-structured](log-structured) to take input from this package and reshape the log to include the `httpRequest` property.
