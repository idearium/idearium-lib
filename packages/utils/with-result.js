'use strict';

// This will take a promise and always use `resolve` to return a result in the format `[err, result]`.
// This provides the ability to use async/wait without try/catch blocks.
// Use it like so:
// // const [err, result] = await withResult(someAsyncFn());
// // if (err) {
// //      return console.log(err);
// // }
// // do other stuff knowing an error didn't occur.
const withResult = (p) =>
    new Promise((resolve) => {
        p.then((result) => resolve([null, result])).catch((err) =>
            resolve([err, null])
        );
    });

module.exports = withResult;
