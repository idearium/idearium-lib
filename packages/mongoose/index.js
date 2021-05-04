'use strict';

const log = require('@idearium/log')();

const setupMongoose = (mongoose) => {
    mongoose.Promise = global.Promise;

    mongoose.plugin((schema) => {
        schema.options.usePushEach = true;
    });
};

// Allow overriding the defaults.
const getOptions = (opts = {}) => {
    if (!opts.mongoose) {
        throw new Error('You must provide a mongoose instance.');
    }

    return Object.assign(
        {},
        {
            reconnectInterval: 500,
            reconnectTries: Number.MAX_VALUE,
            sslValidate: Boolean(opts.ssl || opts.tls),
            useMongoClient: true
        },
        opts
    );
};

const getDbInfo = (connection) => ({
    db: `${connection.host}:${connection.port}`
});

const connect = async (uri, opts = {}) => {
    if (!uri) {
        throw new Error(`uri must be provided`);
    }

    const options = getOptions(opts);
    const { mongoose } = options;

    setupMongoose(mongoose);

    log.info('Connecting to the database...');

    const connection = await mongoose.connect(uri, options);

    log.info(getDbInfo(connection), 'Connected to the database');

    return mongoose;
};

const createConnections = async (uris, opts = {}) => {
    if (!uris) {
        throw new Error(`uris array must be provided`);
    }

    const options = getOptions(opts);
    const { mongoose } = options;

    setupMongoose(mongoose);

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

    return mongoose;
};

module.exports = { connect, createConnections };
