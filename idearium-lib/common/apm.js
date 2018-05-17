'use strict';

const apm = require('elastic-apm-node');
const config = require('./config');
const exception = require('./exception');

const ignoreUrls = (config.get('elasticApmIgnoreUrls') || '').split(',');
const logLevel = config.get('elasticApmLogLevel') || 'debug';
const serverUrl = config.get('elasticApmServerUrl') || 'apm.idearium.io';

// Set some defaults.
if (!ignoreUrls.length) {

    ignoreUrls.push('/_status/ping');
    ignoreUrls.push('/version.json');

}

apm.start({
    ignoreUrls,
    logLevel,
    serverUrl,
});

process.on('unhandledRejection', err => apm.captureError(err, () => exception(err)));

apm.handleUncaughtExceptions(exception);

module.exports = apm;
