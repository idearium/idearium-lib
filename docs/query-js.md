# Query.js

Our query.js file is a simple wrapper around the Mongoose `find` and `findOne` functions.
It simplifies the function structure and allows you to pass all Mongoose chaining options inside of a simple object.

## Examples

Here are some examples with the default options.

```javascript
find(Model, {
    filter: {},
    lean: true,
    limit: 10,
    projection: '_id',
}).exec()

findOne(Model, {
    filter: {},
    lean: true,
    projection: '_id',
}).exec()
```

You can also pass a `*` to project all fields.

```javascript
find(Model, {
    filter: {},
    lean: true,
    limit: 10,
    projection: '*',
}).exec()
```

## Mongoose plugin

We also include a Mongoose plugin that further simplifies using the above functions.

In your project, simply include the plugin:

```javascript
const mongoose = require('mongoose');
const { queryPlugin } = require('@idearium/idearium-lib').query;

mongoose.plugin(queryPlugin);
```

Now all your models will automatically contain the static functions `findOneDocument` and `findDocuments` which are just aliases to the above functions.

To use it:

```javascript
Model.findDocuments({
    filter: {},
    lean: true,
    limit: 10,
    projection: '_id',
}).exec()

Model.findOneDocument({
    filter: {},
    lean: true,
    projection: '_id',
}).exec()
```
