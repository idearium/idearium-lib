'use strict';

const manager = require('./messages');
const log = require('@idearium/log')();

/**
 * Check if a RabbitMQ message exists before publishing.
 * @param {String} type Message type.
 * @param {Object} data Message data.
 * @return {Promise} Publishes the message.
 */
const publish = (type, data) => {

    return manager.publish(type, data)
        .then(() => log.trace({ data, type }, `Published message of type: ${type}`))
        .catch(err => log.warn({ err }, `Could not publish message of type: ${type}`));

};

module.exports = publish;
