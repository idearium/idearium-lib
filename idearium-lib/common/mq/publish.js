'use strict';

const client = require('./client');
const debug = require('debug')('idearium-lib:common:mq:publish');

/**
 * Publish a MQ message.
 * @param {Object} options The publish options.
 * @param {String} options.exchange The exchange string.
 * @param {Object} [options.exchangeOptions={ durable: true }] The exchange options.
 * @param {String} [options.exchangeType='topic'] The exchange type.
 * @param {String} [options.publishOptions={ persistent: true }] The publishing options.
 * @param {String} options.routingKey The routingKey.
 * @return {Function} Returns a function that publishes the message.
 */
const publish = options => data => client.publish((channel) => {

    const {
        exchange,
        exchangeOptions,
        exchangeType,
        publishOptions,
        routingKey,
    } = Object.assign({
        exchangeOptions: { durable: true },
        exchangeType: 'topic',
        publishOptions: { persistent: true },
    }, options);

    return channel.assertExchange(exchange, exchangeType, exchangeOptions)
        .then(() => {

            debug('Publishing message: %O', {
                data,
                exchange,
                routingKey,
            });

            return channel.publish(
                exchange,
                routingKey,
                Buffer.from(JSON.stringify(data)),
                publishOptions
            );

        })
        .then(() => debug(`Published to ${exchange} exchange: %O`, { data }))
        .catch(err => debug('MQ error: %O', err));

});

module.exports = { publish };
