'use strict';

const apm = require('elastic-apm-node');
const config = require('./config');

const ignoreUrls = (config.get('opbeatIgnoreUrls') || '').split(',');

// Set some defaults.
if (!ignoreUrls.length) {

    ignoreUrls.push('/ping');
    ignoreUrls.push('/version.json');

}

apm.start({ ignoreUrls });

process.on('unhandledRejection', err => apm.captureError(err));

apm.handleUncaughtExceptions(require('./exception'));

module.exports = apm;
