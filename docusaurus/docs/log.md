---
id: log
title: '@idearium/log'
---

The Idearium JSON logger. Uses [Pino](https://getpino.io/) under the hood.

## Installation

```shell
$ yarn add @idearium/log
```

## Usage

```JavaScript
const log = require('@idearium/log')();

log.info('A simple example of @idearium/log');
```

The above produces the following log output:

```
{
    level: 30,
    severity: 'INFO',
    time: '2021-05-05T04:17:45.096Z',
    'logging.googleapis.com/sourceLocation': {
        file: '/tests/index.test.js'
    },
    message: 'A simple example of @idearium/log'
}
```

### Configuration

There are two methods to configure the Idearium logger:

-   Using predefined environment variables for the most common configurations.
-   Using an options object for complete customisation.

#### Environment variables

The Idearium logger can be configured with environment variables:

-   `LOG_ENABLED` - Whether to enable the logger or not. Defaults to `true`.
-   `LOG_LEVEL` - The minimum log level to log. Defaults to `info`. Other accepted values are `trace | debug | info | warn | error | fatal`.
-   `LOG_PRETTY_PRINT` - Whether to pretty print the logs or not, useful for development. Defaults to `false`.
-   `LOG_REDACT_PATHS` - Optionally provide a comma separated list of paths to redact. [https://github.com/pinojs/pino/blob/master/docs/redaction.md#path-syntax](https://github.com/pinojs/pino/blob/master/docs/redaction.md#path-syntax)

#### Options

Please be aware that the Idearium Logger has been setup to support [GCP structured logging](https://cloud.google.com/logging/docs/structured-logging) and that altering any of the options could reduce the effectiveness of that integration.

**`sourceLocation`**

By default the logger will determine the file in which the log took place and put this information in the `logging.googleapis.com/sourceLocation` property. You can customise this by providing the `sourceLocation` option.

Further to this, you can pass in any [options supported by Pino](https://getpino.io/#/docs/api?id=options).

## Transports

The Idearium logger does not support transports out of the box. See [@idearium/log-insightops](https://idearium.github.io/idearium-lib/docs/log) for a transport for InsightOps.
