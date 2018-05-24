'use strict';

const apm = require('elastic-apm-node');
const exception = require('./exception');
const log = require('./log')('idearium-lib:common/apm');

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

// Just capture and log the error.
process.on('unhandledRejection', err => apm.captureError(err, () => log.error({ err }, err.message)));

apm.handleUncaughtExceptions(exception);

module.exports = apm;
