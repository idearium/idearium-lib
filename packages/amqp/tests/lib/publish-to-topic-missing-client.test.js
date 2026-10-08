'use strict';

jest.mock('@idearium/log', () => {
    const logger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn() };

    return jest.fn(() => logger);
});

jest.mock('amqplib', () => {
    const err = new Error("Cannot find module 'amqplib'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
});

jest.mock('@cloudamqp/amqp-client', () => {
    const err = new Error("Cannot find module '@cloudamqp/amqp-client'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
});

const publishToTopic = require('../../lib/publish-to-topic');

it('rejects when neither amqplib nor @cloudamqp/amqp-client is installed', async () => {
    await expect(
        publishToTopic({
            exchange: 'ex',
            mqUrl: 'amqp://mq',
            payload: {},
            routingKey: 'key',
        }),
    ).rejects.toThrow(
        'The publishToTopic function requires either amqplib or @cloudamqp/amqp-client to be installed',
    );
});
