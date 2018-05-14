'use strict';

const apm = require('elastic-apm-node');
const config = require('./config');
const exception = require('./exception');

const ignoreUrls = (config.get('elasticApmIgnoreUrls') || '').split(',');
const logLevel = config.get('elasticApmLogLevel') || 'debug';

// Set some defaults.
if (!ignoreUrls.length) {

    ignoreUrls.push('/ping');
    ignoreUrls.push('/version.json');

}

apm.start({
    ignoreUrls,
    logLevel,
});

process.on('unhandledRejection', err => apm.captureError(err, exception));

apm.handleUncaughtExceptions(exception);

module.exports = apm;
