'use strict';

const EventEmitter = require('events');

const mockedConnect = () => {
    const mock = new EventEmitter();

    const exchanges = {};
    const queues = {};

    mock.isConnected = () => true;
    mock.createChannel = async () => {
        const channel = new EventEmitter();

        const mockAssertExchange = (exchange, type) => {
            const findQueue = (routingKey) =>
                Object.values(queues).find(
                    ({ bind }) => bind === `${exchange}${routingKey}`
                );

            const prepareData = (dataAsBuffer) => ({ content: dataAsBuffer });

            const types = {
                topic: (routingKey, dataAsBuffer) => {
                    const result = findQueue(routingKey);

                    if (result && result.consumers.length >= 1) {
                        result.consumers[0](prepareData(dataAsBuffer));
                    }
                },
                fanout: (routingKey, dataAsBuffer) => {
                    const result = findQueue(routingKey);

                    if (result && result.consumers.length >= 1) {
                        result.consumers.forEach((consumer) =>
                            consumer(prepareData(dataAsBuffer))
                        );
                    }
                },
            };

            if (!exchanges[exchange]) {
                exchanges[exchange] = types[type];
            }

            return exchanges[exchange];
        };
        const mockAssertQueue = (name) => {
            if (!queues[name]) {
                queues[name] = {
                    consumers: [],
                };
            }

            return queues[name];
        };
        const mockBindQueue = (queue, exchange, routingKey) => {
            // Here we need to bind the exchange and routingKey to the queue
            // The queue will actually publish it.
            queues[queue].bind = `${exchange}${routingKey}`;
        };
        const mockConsume = (queue, consumer) => {
            queues[queue].consumers.push(consumer);
        };
        const mockPublish = (exchange, routingKey, dataAsBuffer) => {
            exchanges[exchange](routingKey, dataAsBuffer);

            // Return true, otherwise false for a drain
            return true;
        };

        const mockAck = () => {};

        channel.ack = mockAck;
        channel.assertExchange = mockAssertExchange;
        channel.assertQueue = mockAssertQueue;
        channel.bindQueue = mockBindQueue;
        channel.consume = mockConsume;
        channel.publish = mockPublish;

        return channel;
    };

    return mock;
};

module.exports = mockedConnect;
