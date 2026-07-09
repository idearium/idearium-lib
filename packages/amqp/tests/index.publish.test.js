'use strict';

jest.mock('../lib/connect');
jest.mock('../lib/publish');

const amqp = require('../');
const publishFactory = require('../lib/publish');

it('propagates a rejection from the inner publish', async () => {
    const innerPublish = jest.fn().mockRejectedValue(new Error('boom'));
    publishFactory.mockImplementation(() => ({
        publish: innerPublish,
    }));

    const client = await amqp('amqps://localhost:5671/');

    await expect(
        client.publish('n', { a: 1 }, { exchange: 'e', routingKey: 'r' }),
    ).rejects.toThrow('boom');

    expect(innerPublish).toHaveBeenCalledWith(
        'n',
        { a: 1 },
        { exchange: 'e', routingKey: 'r' },
    );
});

it('resolves when the inner publish resolves', async () => {
    const innerPublish = jest.fn().mockResolvedValue(undefined);
    publishFactory.mockImplementation(() => ({
        publish: innerPublish,
    }));

    const client = await amqp('amqps://localhost:5671/');

    await expect(
        client.publish('n', {}, { exchange: 'e', routingKey: 'r' }),
    ).resolves.toBeUndefined();
});
