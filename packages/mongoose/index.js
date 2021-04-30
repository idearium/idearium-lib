'use strict';

const mongoose = require('mongoose');
const log = require('@idearium/log')();

mongoose.Promise = global.Promise;

// Allow overriding the defaults.
const getOptions = (opts = {}) =>
    Object.assign(
        {},
        {
            reconnectInterval: 500,
            reconnectTries: Number.MAX_VALUE,
            sslValidate: Boolean(opts.ssl || opts.tls),
            useMongoClient: true
        },
        opts
    );

const getDbInfo = (connection) => ({
    db: `${connection.host}:${connection.port}`
});

const connect = async (uri, opts = {}) => {
    if (!uri) {
        throw new Error(`uri must be provided`);
    }

    const options = getOptions(opts);

    log.info('Connecting to database...');

    const connection = await mongoose.connect(uri, options);

    log.info(getDbInfo(connection), 'Connected to the database');

    return connection;
};

const createConnections = async (uris, opts = {}) => {
    if (!uris) {
        throw new Error(`uris array must be provided`);
    }

    const options = getOptions(opts);

    log.info('Creating connections to the databases...');

    const connections = await Promise.all(
        uris.map((uri) => mongoose.createConnection(uri, options))
    );

    log.info(
        {
            dbs: connections.map((connection) => getDbInfo(connection))
        },
        'Connected to the databases'
    );

    return connections;
};

module.exports = { connect, createConnections };
