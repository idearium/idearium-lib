# idearium-lib

![@idearium/encryption](https://github.com/idearium/idearium-lib/workflows/@idearium/encryption/badge.svg)
![@idearium/lists](https://github.com/idearium/idearium-lib/workflows/@idearium/lists/badge.svg)
![@idearium/log](https://github.com/idearium/idearium-lib/workflows/@idearium/log/badge.svg)
[![codecov](https://codecov.io/gh/idearium/idearium-lib/branch/master/graph/badge.svg)](https://codecov.io/gh/idearium/idearium-lib)

This repository contains a collection of packages that make up the shared libraries for Idearium applications running on Node.js. Any code that is used across multiple applications (or within multiple Docker containers) should live here.

You can read more about how the libraries work by reading [the documentation](https://idearium.github.io/idearium-lib).

## Contributing

### Documentation

We use [Docusaurus](https://docusaurus.io/en/) for our documentation. To get started

```shell
$ cd docusaurus/website
$ yarn start
```

It's that easy! You can now make changes to the documentation and they will be live reloaded in the browser.

### Libraries

All the libraries are stored under `packages/*`. We currently have the following:

-   `@idearium/encryption` - Making it painless to encrypt and decrypt plain text.
-   `@idearium/lists` - Manage multiple lists of information and retrieve the data in various formats.
-   `@idearium/log` - To manage application logging and optionally log to a remote server (InsightOps).
