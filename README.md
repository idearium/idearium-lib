# idearium-lib

![docs](https://github.com/idearium/idearium-lib/workflows/docs/badge.svg)

This repository contains a collection of packages that make up the shared libraries for Idearium applications running on Node.js. Any code that is used across multiple applications (or within multiple Docker containers) should live here.

You can read more about how the libraries work by reading [the documentation](https://idearium.github.io/idearium-lib).

## Libraries

All the libraries are stored under `packages/*`.

### [@idearium/apm](https://idearium.github.io/idearium-lib/docs/apm)

![@idearium/apm](https://github.com/idearium/idearium-lib/workflows/@idearium/apm/badge.svg)

Defaults for our Elastic APM integration.

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

To manage application logging and optionally log to a remote server (InsightOps).

### [@idearium/mongoose](https://idearium.github.io/idearium-lib/docs/mongoose)

![@idearium/mongoose](https://github.com/idearium/idearium-lib/workflows/@idearium/mongoose/badge.svg)

Easily create connections to MongoDB via Mongoose.

### [@idearium/utils](https://idearium.github.io/idearium-lib/docs/utils)

![@idearium/utils](https://github.com/idearium/idearium-lib/workflows/@idearium/utils/badge.svg)

Node.js utility functions.

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
