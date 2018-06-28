'use strict';

const apm = require('elastic-apm-node');

apm.exception = require('./exception');

/* eslint-disable no-process-env */
const ignoreUrls = (process.env.ELASTIC_APM_IGNORE_URLS || '').split(',');
const logLevel = process.env.ELASTIC_APM_LOG_LEVEL || 'debug';
const serverUrl = process.env.ELASTIC_APM_SERVER_URL || 'https://apm.idearium.io:8200';
/* eslint-enable no-process-env */

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

process.on('unhandledRejection', err => apm.captureError(err, () => apm.exception(err)));

apm.handleUncaughtExceptions(apm.exception);

module.exports = apm;
