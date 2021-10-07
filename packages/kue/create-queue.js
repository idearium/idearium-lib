'use strict';

const kue = require('kue');
const log = require('@idearium/log')();
const redis = require('@idearium/redis');

const constructCreateMethod = (queue) => (type, properties) => {
    if (!type) {
        throw new Error('Type is missing');
    }

    if (!properties) {
        throw new Error('Properties is missing');
    }

    // Always add routingKey as a required property.
    if (type === 'webhook' && !properties.includes('routingKey')) {
        properties.push('routingKey');
    }

    return (title, options) =>
        new Promise((resolve, reject) => {
            if (
                !properties.every((prop) => Object.keys(options).includes(prop))
            ) {
                return reject(
                    new Error('Options is missing some required properties')
                );
            }

            const settings = {
                attempts: 5,
                backoff: {
                    delay: 3 * 60 * 1000,
                    type: 'fixed',
                },
                title,
            };

            Object.assign(settings, options);

            const job = queue.create(type, settings);

            job.attempts(settings.attempts)
                .backoff(settings.backoff)
                .save((err) => {
                    if (err) {
                        queue.emit('job failed', settings);

                        log.error(
                            { err, title, type },
                            'An error occurred when creating a job.'
                        );

                        return reject(
                            new Error(
                                `Failed to create job: ${title} of type ${type}`
                            )
                        );
                    }

                    queue.emit('job enqueued', settings);

                    return resolve(settings);
                });
        });
};

const exception = (err) => log.error({ err }, err.message);

let connection;

const connect = (opts = {}) => {
    if (connection) {
        return connection;
    }

    const prefix = process.env.KUE_PREFIX;

    if (!(prefix || opts.prefix)) {
        throw new Error(
            'You must define an environment variable called KUE_PREFIX or set the prefix option.'
        );
    }

    const queue = kue.createQueue({
        prefix,
        redis: { createClientFactory: () => redis() },
        ...opts,
    });

    queue.exception = exception;
    queue.constructCreateMethod = constructCreateMethod(queue);

    queue.on('error', queue.exception);

    connection = queue;

    return queue;
};

module.exports = connect;
