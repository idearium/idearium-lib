'use strict';

const { EventEmitter } = require('events');

jest.mock('amqplib', () => ({
    connect: jest.fn(),
}));
jest.mock('@idearium/log', () => () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

const amqp = require('amqplib');
const connect = require('../../lib/connect');

const url = 'amqps://localhost:5671/';

beforeEach(() => {
    jest.clearAllMocks();
});

it('does not throw on close by default and flips isConnected to false', async () => {
    const connection = new EventEmitter();
    amqp.connect.mockResolvedValue(connection);

    const conn = await connect(url);

    expect(conn.isConnected()).toBe(true);

    const listener = connection.listeners('close')[0];
    await expect(listener()).resolves.toBeUndefined();

    expect(conn.isConnected()).toBe(false);
});

it('rejects on close when exitOnClose is true', async () => {
    const connection = new EventEmitter();
    amqp.connect.mockResolvedValue(connection);

    await connect(url, { exitOnClose: true });

    const listener = connection.listeners('close')[0];
    await expect(listener()).rejects.toThrow(
        'The connection to the AMQP server closed.',
    );
});

it('isConnected returns true before close', async () => {
    const connection = new EventEmitter();
    amqp.connect.mockResolvedValue(connection);

    const conn = await connect(url);

    expect(conn.isConnected()).toBe(true);
});

it('strips exitOnClose before forwarding opts to amqplib.connect', async () => {
    const connection = new EventEmitter();
    amqp.connect.mockResolvedValue(connection);

    await connect(url, { exitOnClose: true, cert: 'c', key: 'k' });

    expect(amqp.connect).toHaveBeenCalledWith(
        url,
        expect.not.objectContaining({ exitOnClose: true }),
    );
    expect(amqp.connect).toHaveBeenCalledWith(url, { cert: 'c', key: 'k' });
});

it('throws when mqUrl is not provided', async () => {
    await expect(connect()).rejects.toThrow('mqUrl parameter is required');
});
