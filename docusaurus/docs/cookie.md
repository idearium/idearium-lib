---
id: cookie
title: '@idearium/cookie'
---

A library to make working with cookies painless.

## Installation

```shell
$ yarn add -E @idearium/cookie
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/cookie@beta
```

## Usage

To use `@idearium/cookie`, simply require it at the top of your file.

`@idearium/cookie` exports a number of pure functions to help you work with cookies:

-   `create` - creates a cookie.
-   `find` - finds and parses a cookie in a HTTP cookie header string.

### create

To create a new cookie:

```js
const { create } = require('@idearium/cookie');

await create({
    data: { cookiedata: 'bar' },
    name: 'foo',
    signed: true
});
```

### find

To find and parse a specific cookie within the cookie header:

```js
const { find } = require('@idearium/cookie');

const [err, cookie] = await find({
    cookies: req.headers.cookie,
    name: 'foo',
    signed: true
});

// { cookiedata: 'bar' }
```
