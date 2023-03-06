'use strict';

const collect = (emitter, name, times = 2) =>
    new Promise((resolve, reject) => {
        const collection = [];

        if (name !== 'error') {
            emitter.once('error', reject);
        }

        emitter.on(name, (...args) => {
            collection.push(...args);

            if (collection.length === times) {
                emitter.removeListener('error', reject);
                resolve(collection);
            }
        });
    });

const once = (emitter, name) =>
    new Promise((resolve, reject) => {
        if (name !== 'error') {
            emitter.once('error', reject);
        }

        emitter.once(name, (...args) => {
            emitter.removeListener('error', reject);
            resolve(...args);
        });
    });

const sink = () => {
    const split = require('split2');

    const result = split((data) => {
        try {
            return JSON.parse(data);
        } catch (err) {
            console.log(err);
            console.log(data);
        }
    });

    return result;
};

module.exports = { collect, once, sink };
