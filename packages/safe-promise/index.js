'use strict';

export const safePromise = (p) =>
    new Promise((resolve) => {
        p.then((result) => resolve([null, result])).catch((err) =>
            resolve([err])
        );
    });
