'use strict';

const client = require('./client');
const debug = require('debug')('idearium-lib:common:mq:util');
const { isArray } = require('../../').util;

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

/**
 * Consume a MQ message.
 * @param {Function} action The function to process the message. This should take a data array as the only parameter and must return a promise.
 * @param {Object} options The consume options.
 * @param {Object} [options.consumeOptions={ noAck: false }] The consume options.
 * @param {String} options.exchange The exchange string.
 * @param {Object} [options.exchangeOptions={ durable: true }] The exchange options.
 * @param {String} [options.exchangeType='topic'] The exchange type.
 * @param {String} options.queue The queue name.
 * @param {Object} [options.queueOptions={ durable: true }] The queue options.
 * @param {String} options.routingKey The routingKey.
 * @return {Function} Returns a function that publishes the message.
 */
const consume = (action, options) => () => client.consume((channel) => {

    const {
        consumeOptions,
        exchange,
        exchangeOptions,
        exchangeType,
        queue,
        queueOptions,
        routingKey,
    } = Object.assign({
        consumeOptions: { noAck: false },
        exchangeOptions: { durable: true },
        exchangeType: 'topic',
        queueOptions: { durable: true },
    }, options);

    const processMessage = (msg) => {

        debug('Consuming message: %O', {
            data: msg.content.toString(),
            exchange,
            queue,
            routingKey,
        });

        let data;

        try {

            data = JSON.parse(msg.content.toString());

        } catch (err) {

            debug('MQ error reading data: %O', { err, msg: msg.content.toString() });

            return channel.ack(msg);

        }

        if (!isArray(data)) {
            data = [data];
        }

        action(data)
            .then(() => channel.ack(msg))
            .catch((err) => {

                debug('Error processing message: %O', err);

                return channel.ack(msg);

            });

    };

    return channel.assertExchange(exchange, exchangeType, exchangeOptions)
        .then(() => channel.assertQueue(queue, queueOptions))
        .then(() => channel.bindQueue(queue, exchange, routingKey))
        .then(() => channel.consume(queue, processMessage, consumeOptions))
        .catch(err => debug('MQ error: %O', err));

});

module.exports = { consume, publish };
