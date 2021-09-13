---
id: cookie
title: '@idearium/cookie'
---

Idearium cookie wrapper.

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
-   `find` - finds a cookie in a HTTP cookie header string.

### create

To create a new cookie:

```js
const { create } = require('@idearium/cookie');

await create({
    cookie: 'cookie string value',
    name: 'foo',
});
```

The create function uses the [cookie](https://www.npmjs.com/package/cookie#options-1) library in the background and can accept any `serialize` options listed there.

### find

To find a specific cookie within the cookie header:

```js
const { find } = require('@idearium/cookie');

const cookie = await find({
    cookies: req.headers.cookie,
    name: 'foo',
});

// 'cookie string value'
```

The find function uses the [cookie](https://www.npmjs.com/package/cookie#options) library in the background and can accept any `parse` options listed there.
