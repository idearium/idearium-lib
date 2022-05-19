---
id: promise-all-settled
title: '@idearium/promise-all-settled'
---

Makes working with `Promise.allSettled` easier.

## Installation

```shell
$ yarn add -E @idearium/promise-all-settled
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/promise-all-settled@beta
```

## Usage

### promiseAllSettled

To use `promiseAllSettled`, require it from `@idearium/promise-all-settled`.

```js
const promiseAllSettled = require('@idearium/promise-all-settled');
```

`promiseAllSettled` will take an array of promises and return a result in the format `[errors, results]`. The result will always contain all promises passed to it as it waits until all promises have settled before it returns.

This provides the ability to use async/await without try/catch blocks.

Use it like so:

```js
const [errs, results] = await promiseAllSettled([someAsyncFn1, someAsyncFn2]);

if (errs.length) {
    return console.log(errs);
}

// Do other stuff knowing an error didn't occur.
```
