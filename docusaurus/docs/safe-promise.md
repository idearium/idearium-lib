---
id: safe-promise
title: '@idearium/safe-promise'
---

Makes working with promises safer.

## Installation

```shell
$ yarn add -E @idearium/safe-promise
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/safe-promise@beta
```

## Usage

### safePromise

To use `safePromise`, require it from `@idearium/safe-promise`.

```js
const safePromise = require('@idearium/safe-promise');
```

This will take a promise and always use `resolve` to return a result in the format `[err, result]`.

This provides the ability to use async/wait without try/catch blocks.

Use it like so:

```js
const [err, result] = await safePromise(someAsyncFn);

if (err) {
    return console.log(err);
}

// Do other stuff knowing an error didn't occur.
```
