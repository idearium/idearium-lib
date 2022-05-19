---
id: safe-promise-all
title: '@idearium/safe-promise-all'
---

Makes working with promises safer.

## Installation

```shell
$ yarn add -E @idearium/safe-promise-all
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/safe-promise-all@beta
```

## Usage

### safePromiseAll

To use `safePromiseAll`, require it from `@idearium/safe-promise-all`.

```js
const safePromiseAll = require('@idearium/safe-promise-all');
```

This will take an array of promises and always use `resolve` to return a result in the format `[errs, results]`.

This provides the ability to use async/wait without try/catch blocks.

Use it like so:

```js
const [errs, results] = await safePromiseAll([someAsyncFn1, someAsyncFn2]);

if (errs.length) {
    return console.log(errs);
}

// Do other stuff knowing an error didn't occur.
```
