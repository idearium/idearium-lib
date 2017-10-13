'use strict';

const manager = require('./messages');
const log = require('../log')('idearium-lib:common:mq/publisher');

/**
 * Check if a RabbitMQ message exists before publishing.
 * @param {String} type Message type.
 * @param {Object} data Message data.
 * @return {Promise} Publishes the message.
 */
const publish = (type, data) => {

    return manager.publish(type, data)
        .then(() => {

            log.debug({ data, type }, `Publishing message of type: ${type}`);

        });

};

module.exports = publish;
