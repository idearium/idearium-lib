'use strict';

const withResult = (p) =>
    new Promise((resolve) => {
        p.then((result) => resolve([null, result])).catch((err) =>
            resolve([err, null])
        );
    });

module.exports = withResult;
