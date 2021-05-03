---
id: log-insightops
title: '@idearium/log-insightops'
---

The Idearium logger InsightOps transport.

## Installation

```shell
$ yarn add @idearium/log-insightops
```

## Usage

The Idearium logger InsightOps transport takes log output from [`@idearium/log`](https://idearium.github.io/idearium-lib/docs/log) and sends it to InsightOps.

To do so, you will need the configure some environment variables:

-   `INSIGHT_OPS_REGION` - The InsightOps region.
-   `INSIGHT_OPS_TOKEN` - The InsightOps token.

Then start your Node application and pipe the output to the `insightops` script (found at `node_modules/.bin/insightops` once this package is installed):

```shell
$ node server.js | insightops
```

### Combining Transports

Sometimes you will want to use multiple transports. To do this you can use the `tee` command in bash:

```shell
$ node server.js | tee insightops pino-stackdriver --project bar --credentials /credentials.json
```
