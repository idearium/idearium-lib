'use strict';

const manager = require('./messages');
const { hasProperty } = require('../../lib/util');
const log = require('../log')('idearium-lib:common:mq/publisher');

/**
 * Check if a RabbitMQ message exists before publishing.
 * @param {String} type Message type.
 * @param {Object} data Message data.
 * @return {Promise} Publishes the message.
 */
const publish = (type, data) => {

    if (!hasProperty(manager.messages, type)) {
        return log.error(`Message of type: ${type} not found`);
    }

    log.debug({ data, type }, `Publishing message of type: ${type}`);

    // Publish the message (returning a Promise).
    return manager.messages[type].publish(data);

}

module.exports = publish;
