'use strict';

const safePromiseAll = (arrP) =>
    Promise.allSettled(arrP).then((results) => {
        const errors = results
            .filter(({ status }) => status === 'rejected')
            .map(({ reason }) => reason)
            .flat();

        if (errors.length > 0) {
            return [errors];
        }

        const values = results
            .filter(({ status }) => status === 'fulfilled')
            .map(({ value }) => value)
            .flat();

        return [null, values];
    });

module.exports = safePromiseAll;
