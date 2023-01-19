'use strict';

const promiseAllSettled = (arrP) =>
    Promise.allSettled(arrP).then((results) => [
        results
            .filter(({ status }) => status === 'rejected')
            .map(({ reason }) => reason),
        results
            .filter(({ status }) => status === 'fulfilled')
            .map(({ value }) => value),
    ]);

module.exports = promiseAllSettled;
