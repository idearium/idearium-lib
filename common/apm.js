'use strict';

const apm = require('elastic-apm-node');
const exception = require('./exception');

/**
 * Start Apm.
 * @param {Object} options The options object.
 * @param {Function} options.exceptionHandler Must be provided if a custom options is passed.
 * @returns {Object} Starts and returns Apm.
 */
const start = (options = { exceptionHandler: exception }) => {

    apm.exceptionHandler = options.exceptionHandler;

    process.on('unhandledRejection', err => apm.captureError(err, () => apm.exceptionHandler(err)));

    apm.handleUncaughtExceptions(apm.exceptionHandler);

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

    // Wrap the start function in an if to enable testing multiple times.
    // eslint-disable-next-line no-process-env
    if (process.env.ELASTIC_APM_ACTIVE !== 'false') {

        apm.start({
            ignoreUrls,
            logLevel,
            serverUrl,
        });

    }

    return apm;

};

module.exports = { start };
