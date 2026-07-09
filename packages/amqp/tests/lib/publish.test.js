'use strict';

const channels = require('../../lib/publish');

const createChannelStub = () => ({
    on: jest.fn(),
    assertExchange: jest.fn().mockResolvedValue(),
    publish: jest.fn().mockReturnValue(true),
});

const createConnectionStub = () => ({
    createChannel: jest.fn().mockResolvedValue(createChannelStub()),
});

it('scopes the channel cache per connection (not shared across calls)', async () => {
    const conn1 = createConnectionStub();
    const conn2 = createConnectionStub();

    const options = { exchange: 'e', routingKey: 'r' };

    await channels(conn1).publish('name', { a: 1 }, options);
    await channels(conn2).publish('name', { a: 2 }, options);

    expect(conn1.createChannel).toHaveBeenCalledTimes(1);
    expect(conn2.createChannel).toHaveBeenCalledTimes(1);
});

it('propagates a createChannel rejection from publish', async () => {
    const conn = createConnectionStub();
    conn.createChannel.mockRejectedValueOnce(new Error('boom'));

    await expect(
        channels(conn).publish('n', {}, { exchange: 'e', routingKey: 'r' }),
    ).rejects.toThrow('boom');
});

it('clears the cache after rejection so the next publish retries', async () => {
    const conn = createConnectionStub();
    conn.createChannel.mockRejectedValueOnce(new Error('boom'));

    const channelsFactory = channels(conn);

    await expect(
        channelsFactory.publish('n', {}, { exchange: 'e', routingKey: 'r' }),
    ).rejects.toThrow('boom');

    await channelsFactory.publish('n', {}, { exchange: 'e', routingKey: 'r' });

    expect(conn.createChannel).toHaveBeenCalledTimes(2);
});
