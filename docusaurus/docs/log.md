---
id: log
title: @idearium/log
---

The Idearium logger.

## Installation

```shell
$ yarn add @idearium/log
```

## Usage

The Idearium logger takes the following environment variables:

- `LOG_ENABLED` - Whether to enable the logger or not. Defaults to `true`.
- `LOG_LEVEL` - The minimum log level to log. Defaults to `info`. Other accepted values are `trace | debug | info | warn | error | fatal`.
- `PINO_PRETTY_PRINT` - Whether to pretty print the logs or not, useful for development. Defaults to `true`.
- `PINO_REDACT_PATHS` - Optionally provide a comma separated list of paths to redact. [https://github.com/pinojs/pino/blob/master/docs/redaction.md#path-syntax](https://github.com/pinojs/pino/blob/master/docs/redaction.md#path-syntax)

If you wish to log to a remote server (InsightOps), you will need the following variables:

- `LOG_REMOTE` - Whether to log to a remote server or not. Setting this to `true` will disable pretty printing.
- `INSIGHT_OPS_REGION` - The InsightOps region (`eu`).
- `INSIGHT_OPS_TOKEN` - The InsightOps token.

Since Pino does not natively support in process transports, we expose a remote logging script to send logs to InsightOps.
To use this simply provide the necessary variables above and start the node process:

```shell
$ node server.js | log-remote
```
