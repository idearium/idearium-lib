---
id: utils
title: '@idearium/utils'
sidebar_label: '@idearium/utils'
slug: /utils
---

Idearium utility methods.

## Installation

```shell
$ yarn add -E @idearium/utils
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/utils@beta
```

## Usage

### withResult

To use `withResult`, require it from `@idearium/utils`.

```js
const { withResult } = require('@idearium/utils');
```

This will take a promise and always use `resolve` to return a result in the format `[err, result]`.

This provides the ability to use async/wait without try/catch blocks.

Use it like so:

```js
const [err, result] = await withResult(someAsyncFn);

if (err) {
    return console.log(err);
}

// Do other stuff knowing an error didn't occur.
```
