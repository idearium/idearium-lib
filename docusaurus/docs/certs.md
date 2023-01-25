---
id: certs
title: '@idearium/certs'
---

Easily load custom and OS certificate authority certs into Node.js.

## Installation

```shell
$ yarn add -E @idearium/certs
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/certs@beta
```

## Usage

Use the `loadAllCerts` function to load both OS and custom certs:

```JavaScript
const { loadAllCerts } = require('@idearium/certs');

await loadAllCerts();
```

By default, it will look for custom certs in the `/ssl` directory but this can easily be changed:

```JavaScript
const { loadAllCerts } = require('@idearium/certs');

await loadAllCerts('/certs');
```

Use the `loadProvidedCerts` to load only custom certs:

```JavaScript
const { loadProvidedCerts } = require('@idearium/certs');

await loadProvidedCerts();
```

By default, it will look for custom certs in the `/ssl` directory but this can easily be changed:

```JavaScript
const { loadProvidedCerts } = require('@idearium/certs');

await loadProvidedCerts('/certs');
```
