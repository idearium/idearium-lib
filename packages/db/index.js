'use strict';

const mongoose = require('mongoose');
const log = require('@idearium/log')();

mongoose.Promise = global.Promise;

// Allow overriding the defaults.
const getOptions = (opts = {}) => ({
    ...{
        reconnectInterval: 500,
        reconnectTries: Number.MAX_VALUE,
        sslValidate: Boolean(opts.ssl || opts.tls),
        useMongoClient: true
    },
    ...opts
});

const getDbInfo = (connection) => {
    const connStr = `${connection.host}:${connection.port}`;

    return {
        db: connStr,
        proxies: [
            ...connection.db.s.topology.s.mongos.connectingProxies,
            ...connection.db.s.topology.s.mongos.connectedProxies
        ]
            .map(
                ({
                    s: {
                        serverDescription: { address }
                    }
                }) => address
            )
            .filter((str) => str !== connStr)
    };
};

const connect = async (uri, opts = {}) => {
    if (!uri) {
        throw new Error(`options.uri must be provided`);
    }

    const options = getOptions(opts);

    log.info({ options }, 'Connecting to database...');

    const connection = await mongoose.connect(uri, options);

    log.info(getDbInfo(connection), 'Connected to the database');

    return connection;
};

const createConnections = async (uris, opts = {}) => {
    if (!uris) {
        throw new Error(`options.uris must be provided`);
    }

    const options = getOptions(opts);

    log.info({ options }, 'Creating connections to the databases...');

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
