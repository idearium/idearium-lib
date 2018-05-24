'use strict';

const log = require('./log')('idearium-lib:common/exception');

module.exports = (err) => {

    log.error({ err }, err.message);

    // Quit the process entirely.
    // eslint-disable-next-line no-process-exit
    process.exit(1);

};
