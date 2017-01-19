
// Export library code as required.
module.exports = {

    // Packages here.
    mq: require('./lib/mq'),
    logs: require('./lib/logs'),
    utils: require('./lib/utils'),
    middleware: require('./middleware'),
    emailServices: require('./lib/email-services'),

    // Export classes here.
    Config: require('./lib/config'),
    Loader: require('./lib/loader'),
    Email: require('./lib/email'),
    Hash: require('./lib/hash'),

    // Common
    common: {
        config: require('./common/config'),
        exception: require('./common/exception'),
        mq: {
            client: require('./common/mq/client'),
            messages: require('./common/mq/messages'),
        },
    },

};
