'use strict';

const apm = require('elastic-apm-node');

apm.start({
    ignoreUrls: [
        '/ping',
        '/version.json',
    ],
});

process.on('unhandledRejection', err => apm.captureError(err));

apm.handleUncaughtExceptions(require('./exception'));

module.exports = apm;
