---
id: log-structured
title: '@idearium/log-structured'
---

The Idearium logger HTTP structured logging formatter.

## Installation

```shell
$ yarn add @idearium/log-structured
```

## Usage

The Idearium logger HTTP structured logging formatter transport takes log output from [`@idearium/log`](log.md) and [`@idearium/log-http`](log-http.md) and structures it according to [GCP Structured Logging](https://cloud.google.com/logging/docs/structured-logging).

Start your Node application and pipe the output to the `structured` script (found at `node_modules/.bin/structured` once this package is installed):

```shell
$ node server.js | structured
```

### Pretty printing

If you want to pretty print the results of this formatter, pipe the output to ['pino-pretty'](https://github.com/pinojs/pino-pretty);

```shell
$ node server.js | structure | pino-pretty
```

### Combining formatters and transports

Sometimes you will want to use multiple transports/formatters. To do this you can use the `tee` command in bash:

```shell
$ node server.js | structured | tee insightops pino-stackdriver --project bar --credentials /credentials.json
```
