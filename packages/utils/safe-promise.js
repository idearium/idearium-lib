'use strict';

const safePromise = (p) =>
    new Promise((resolve) => {
        p.then((result) => resolve([null, result])).catch((err) =>
            resolve([err])
        );
    });

module.exports = safePromise;
