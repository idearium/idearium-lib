'use strict';

jest.mock('../lib/connect');
const amqp = require('../');

it('is a function', () => {
    expect(typeof amqp).toBe('function');
});

it('will connect to amqp server', async () => {
    expect.assertions(2);

    const client = await amqp('amqps://localhost:5671/');

    expect(client).toHaveProperty('consume');
    expect(client).toHaveProperty('publish');
});

it('will setup a consumer', async () => {
    expect.assertions(6);

    const client = await amqp('amqps://localhost:5671/');

    expect(client).toHaveProperty('consume');
    expect(client).toHaveProperty('publish');

    const consume = () => {};

    const consumer = await client.consume('test', consume, {
        exchange: 'test-exchange',
        queue: 'test-queue',
        routingKey: 'test-routingKey',
    });

    expect(consumer).toHaveProperty('channel');
    expect(consumer).toHaveProperty('consumer', consume);
    expect(consumer).toHaveProperty('options', {
        exchange: 'test-exchange',
        queue: 'test-queue',
        routingKey: 'test-routingKey',
    });
    expect(consumer).toHaveProperty('name', 'test');
});

it('will publish a message', async () => {
    expect.assertions(3);

    const client = await amqp('amqps://localhost:5671/');

    expect(client).toHaveProperty('consume');
    expect(client).toHaveProperty('publish');

    const consume = (msg) => {
        const [data] = msg;
        expect(data).toStrictEqual({ data: 'true' });
    };

    await client.consume('publish-test', consume, {
        exchange: 'publish-test-exchange',
        queue: 'publish-test-queue',
        routingKey: 'publish-test-routingKey',
    });

    await client.publish(
        'publish-test',
        { data: 'true' },
        {
            exchange: 'publish-test-exchange',
            routingKey: 'publish-test-routingKey',
        }
    );
});
