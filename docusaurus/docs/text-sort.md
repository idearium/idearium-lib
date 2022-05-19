---
id: text-sort
title: '@idearium/text-sort'
---

Function to allow sorting arrays using functions to generate the sort value.

## Installation

```shell
$ yarn add -E @idearium/text-sort
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/text-sort@beta
```

## Usage

To use `@idearium/text-sort`, simply require it at the top of your file.

There are 3 properties you can pass:

-   array - The array to sort.
-   asc - Whether to sort the array alphabetically or not. Set to false to sort in reverse alphabetical order.
-   sortValue - A function that takes the element to sort and returns the value to sort on.

```js
const textSort = require('@idearium/text-sort');

textSort({
    array: [{ a: 'third' }, { a: 'second' }, { a: 'first' }],
    asc: true, // default
    sortValue: ({ a }) => a,
});
// returns [{ a: 'first' }, { a: 'second' }, { a: 'third' }]

textSort({
    array: [{ a: 'first' }, { a: 'second' }, { a: 'third' }],
    asc: false,
    sortValue: ({ a }) => a,
});
// returns [{ a: 'third' }, { a: 'second' }, { a: 'first' }]
```
