'use strict';

const log = require('@idearium/log')();

const setupMongoose = (mongoose) => {
    mongoose.plugin((schema) => {
        schema.options.usePushEach = true;
    });
};

// Allow overriding the defaults.
const getOptions = (opts = {}) => ({
    sslValidate: Boolean(opts.ssl || opts.tls),
    ...opts,
});

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

    log.info('Connecting to the database...');

    await mongoose.connect(uri, opts);

    log.info(getDbInfo(mongoose?.connection), 'Connected to the database');

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

    log.info('Creating connections to the databases...');

    const connections = await Promise.all(
        uris.map((uri) => mongoose.createConnection(uri, opts).asPromise()),
    );

    log.info(
        {
            dbs: connections.map((connection) => getDbInfo(connection)),
        },
        'Connected to the databases',
    );

    return mongoose;
};

module.exports = { connect, createConnections };
