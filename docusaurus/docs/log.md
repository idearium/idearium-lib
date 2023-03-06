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

## Entry points

There are a few entry points this package.

### `@idearium/log`

This is the primary entry point and is intended to be use with Node.js.

### `@idearium/log/defaults`

These are the defaults used by the package.

### `@idearium/log/multi`

Use this to log different data depending on the `LOG_LEVEL`. It's very useful for including more information when setting `LOG_LEVEL` to `debug` without producing more log messages.

The levels are defined in order as:

-   `trace`
-   `debug`
-   `info`
-   `warn`
-   `error`
-   `fatal`

Multi accepts two parameters:

-   `data`: an object containing nested objects, keyed by the name of the level, which should be included or excluded based on `LOG_LEVEL`.
-   `message`: which will always appear unchanged with the combined data.

`multi` produces a log at the level defined by the highest log level provided in `data`.

`multi` combines the nested objects into one object for logging, and includes any nested object keyed by a level name which is equal to or higher than the `LOG_LEVEL` environment variable.

`multi` has the following attributes, when given the same parameters:

-   Will always produce a log at the same level regardless of `LOG_LEVEL`.
-   Will always produce a log with the same message, meaning you can rely on the log message for filtering, regardless of `LOG_LEVEL`.
-   Can exclude or include more information based on `LOG_LEVEL`.
-   Does not produce more logs when turning on a lower log level, but can include additional information.

#### Examples

##### Standard setup

The following produces a log at the `info` level, because that is the highest level defined in `data`. It excludes the nested `debug` object because `LOG_LEVEL` is set to `info`.

```
// LOG_LEVEL = 'info';

multi({
    debug: { debug: 'debug' },
    info: { info: 'info' },
}, 'Log at info level, excluding debug data.');

// produces:
{
    level: 30,
    severity: 'INFO',
    time: '2023-03-05T23:42:13.085Z',
    'logging.googleapis.com/sourceLocation': {
        file: '/idearium-lib/packages/log/tests/multi.test.js'
    },
    info: 'info',
    message: 'Log at info level, excluding debug data.'
}
```

##### Setup for debugging

```
// LOG_LEVEL = 'debug';

multi({
    debug: { debug: 'debug' },
    info: { info: 'info' },
}, 'Log at info level, include debug data.');

// produces:
{
    level: 30,
    severity: 'INFO',
    time: '2023-03-05T23:42:13.085Z',
    'logging.googleapis.com/sourceLocation': {
        file: '/idearium-lib/packages/log/tests/multi.test.js'
    },
    debug: 'debug',
    info: 'info',
    message: 'Log at info level, include debug data.'
}
```

##### Error logging in standard setup

The following produces a log at the `error` level, because that is the highest level defined in `data`. It excludes the nested `debug` object because `LOG_LEVEL` is set to `info`.

```
// LOG_LEVEL = 'info';

multi({
    debug: { debug: 'debug' },
    error: { error: 'error' },
}, 'Log at error level, excluding debug data.');

// produces:
{
    level: 50,
    severity: 'ERROR',
    time: '2023-03-05T23:42:13.085Z',
    'logging.googleapis.com/sourceLocation': {
        file: '/idearium-lib/packages/log/tests/multi.test.js'
    },
    error: 'error',
    message: 'Log at error level, excluding debug data.'
}
```

##### Error logging in debug setup

The following produces a log at the `error` level, because that is the highest level defined in `data`. It includes the nested `debug` object because `LOG_LEVEL` is set to `debug`.

```
// LOG_LEVEL = 'debug';

multi({
    debug: { debug: 'debug' },
    error: { error: 'error' },
}, 'Log at error level, including debug data.');

// produces:
{
    level: 50,
    severity: 'ERROR',
    time: '2023-03-05T23:42:13.085Z',
    'logging.googleapis.com/sourceLocation': {
        file: '/idearium-lib/packages/log/tests/multi.test.js'
    },
    debug: 'debug'
    error: 'error',
    message: 'Log at error level, including debug data.'
}
```

## Transports

The Idearium logger does not support transports out of the box. See [@idearium/log-insightops](https://idearium.github.io/idearium-lib/docs/log) for a transport for InsightOps.
