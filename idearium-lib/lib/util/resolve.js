'use strict';

/**
 * Given a channel and message, acknowledge it and resolve with a Promise.
 * @param  {Object} channel The channel object.
 * @param  {Object} msg     The message to acknowledge.
 * @return {Promise}        A resolve promise.
 */
const ack = (channel, msg) => {

    channel.ack(msg);

    return Promise.resolve();

};

module.exports = { ack };
