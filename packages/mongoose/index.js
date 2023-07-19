'use strict';

const log = require('@idearium/log')();

const setupMongoose = (mongoose) => {
    mongoose.Promise = global.Promise;

    mongoose.plugin((schema) => {
        schema.options.usePushEach = true;
    });
};

// Allow overriding the defaults.
const getOptions = (opts = {}) =>
    Object.assign(
        {},
        {
            reconnectInterval: 500,
            reconnectTries: Number.MAX_VALUE,
            sslValidate: Boolean(opts.ssl || opts.tls),
            useMongoClient: true,
        },
        opts
    );

const getDbInfo = (connection) => ({
    db: `${connection.host}:${connection.port}/${connection.name}`,
});

const connect = async ({ mongoose, options = {}, uri } = {}) => {
    if (!uri) {
        throw new Error(`uri must be provided`);
    }

    if (!mongoose) {
        throw new Error('You must provide a mongoose instance.');
    }

    const opts = getOptions(options);

    setupMongoose(mongoose);

    log.trace('Connecting to the database...');

    const connection = await mongoose.connect(uri, opts);

    log.trace(getDbInfo(connection), 'Connected to the database');

    return mongoose;
};

const createConnections = async ({ mongoose, options = {}, uris } = {}) => {
    if (!uris) {
        throw new Error(`uris array must be provided`);
    }

    if (!mongoose) {
        throw new Error('You must provide a mongoose instance.');
    }

    const opts = getOptions(options);

    setupMongoose(mongoose);

    log.trace('Creating connections to the databases...');

    const connections = await Promise.all(
        uris.map((uri) => mongoose.createConnection(uri, opts))
    );

    log.trace(
        {
            dbs: connections.map((connection) => getDbInfo(connection)),
        },
        'Connected to the databases'
    );

    return mongoose;
};

module.exports = { connect, createConnections };
