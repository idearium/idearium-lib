# idearium-lib

![docs](https://github.com/idearium/idearium-lib/workflows/docs/badge.svg)

This repository contains a collection of packages that make up the shared libraries for Idearium applications running on Node.js. Any code that is used across multiple applications (or within multiple Docker containers) should live here.

You can read more about how the libraries work by reading [the documentation](https://idearium.github.io/idearium-lib).

## Libraries

All the libraries are stored under `packages/*`.

### [@idearium/apm](https://idearium.github.io/idearium-lib/docs/apm)

![@idearium/apm](https://github.com/idearium/idearium-lib/workflows/@idearium/apm/badge.svg)

Defaults for our Elastic APM integration.

### [@idearium/cookie](https://idearium.github.io/idearium-lib/docs/cookie)

![@idearium/cookie](https://github.com/idearium/idearium-lib/workflows/@idearium/cookie/badge.svg)

A library to make working with cookies in Node.js easier.

### [@idearium/encryption](https://idearium.github.io/idearium-lib/docs/encryption)

![@idearium/encryption](https://github.com/idearium/idearium-lib/workflows/@idearium/encryption/badge.svg)

Making it painless to encrypt and decrypt plain text.

### [@idearium/fetch](https://idearium.github.io/idearium-lib/docs/fetch)

![@idearium/fetch](https://github.com/idearium/idearium-lib/workflows/@idearium/fetch/badge.svg)

Making fetch requests easy.

### [@idearium/lists](https://idearium.github.io/idearium-lib/docs/lists)

![@idearium/lists](https://github.com/idearium/idearium-lib/workflows/@idearium/lists/badge.svg)

Manage multiple lists of information and retrieve the data in various formats.

### [@idearium/log](https://idearium.github.io/idearium-lib/docs/log)

![@idearium/log](https://github.com/idearium/idearium-lib/workflows/@idearium/log/badge.svg)

To manage application logging in Node.js.

### [@idearium/log-http](https://idearium.github.io/idearium-lib/docs/log-http)

![@idearium/log-http](https://github.com/idearium/idearium-lib/workflows/@idearium/log-http/badge.svg)

Express middleware to log HTTP requests.

### [@idearium/log-insightops](https://idearium.github.io/idearium-lib/docs/log-insightops)

![@idearium/log-insightops](https://github.com/idearium/idearium-lib/workflows/@idearium/log-insightops/badge.svg)

Works with @idearium/log to enable sending logs to InsightOps.

### [@idearium/log-structured](https://idearium.github.io/idearium-lib/docs/log-structured)

![@idearium/log-structured](https://github.com/idearium/idearium-lib/workflows/@idearium/log-structured/badge.svg)

Works with @idearium/log to update log output to match [GCP Structured Logging requirements](https://cloud.google.com/logging/docs/structured-logging).

### [@idearium/mongoose](https://idearium.github.io/idearium-lib/docs/mongoose)

![@idearium/mongoose](https://github.com/idearium/idearium-lib/workflows/@idearium/mongoose/badge.svg)

Easily create connections to MongoDB via Mongoose.

### [@idearium/phone](https://idearium.github.io/idearium-lib/docs/phone)

![@idearium/phone](https://github.com/idearium/idearium-lib/workflows/@idearium/phone/badge.svg)

Wrapper around the Twilio phone lookup api.

### [@idearium/promise-all-settled](https://idearium.github.io/idearium-lib/docs/promise-all-settled)

![@idearium/promise-all-settled](https://github.com/idearium/idearium-lib/workflows/@idearium/promise-all-settled/badge.svg)

Makes working with `Promise.allSettled` easier.

### [@idearium/redis](https://idearium.github.io/idearium-lib/docs/redis)

![@idearium/redis](https://github.com/idearium/idearium-lib/workflows/@idearium/redis/badge.svg)

The Idearium ioredis connection wrapper.

### [@idearium/safe-promise](https://idearium.github.io/idearium-lib/docs/safe-promise)

![@idearium/safe-promise](https://github.com/idearium/idearium-lib/workflows/@idearium/safe-promise/badge.svg)

Makes working with Promises safer.

### [@idearium/telemetry](https://idearium.github.io/idearium-lib/docs/telemetry)

![@idearium/telemetry](https://github.com/idearium/idearium-lib/workflows/@idearium/telemetry/badge.svg)

Idearium's implementation of Open Telemetry to support telemetry reporting in Node.js applications.

### [@idearium/text-sort](https://idearium.github.io/idearium-lib/docs/text-sort)

![@idearium/text-sort](https://github.com/idearium/idearium-lib/workflows/@idearium/text-sort/badge.svg)

Function to help sort arrays by text.

## Documentation

We use [Docusaurus](https://docusaurus.io/en/) for our documentation. To get started

```shell
$ cd docusaurus
$ yarn start
```

It's that easy! You can now make changes to the documentation and they will be live reloaded in the browser.

## Legacy

This is a newer version of idearium-lib, in monorepo format. The previous version of was monolithic and is still used in some projects.

In order to be able to maintain that code and release updated versions as required, the [`legacy`](https://github.com/idearium/idearium-lib/tree/legacy) branch exists.

In order to update the older code, branch from `legacy` and create PRs with `legacy` as the base branch.
