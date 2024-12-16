'use strict';

const manager = require('./messages');
const log = require('@idearium/log')();
const multiLog = require('@idearium/log/multi')();

/**
 * Check if a RabbitMQ message exists before publishing.
 * @param {String} type Message type.
 * @param {Object} data Message data.
 * @return {Promise} Publishes the message.
 */
const publish = (type, data) => {

    return manager.publish(type, data)
        .then(() => multiLog(
            {
                debug: { data },
                info: { type },
            },
            'Published message'
        ))
        .catch((err) => log.error({ err, type }, 'Could not publish message'));

};

module.exports = publish;
