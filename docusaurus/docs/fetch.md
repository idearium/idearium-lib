---
id: fetch
title: '@idearium/fetch'
---

Idearium fetch wrapper.

## Installation

```shell
$ npm install -E @idearium/fetch
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ npm install -E @idearium/fetch@beta
```

## Usage

To use `@idearium/fetch`, simply require it at the top of your file.

It is simply a fetch wrapper that automatically parses the body response into a property `result`.

```js
const { ...response, result } = await fetch('...', { fetchOpts });
```
