'use strict';

const apm = require('elastic-apm-node');

apm.start();

apm.handleUncaughtExceptions(require('./exception'));

module.exports = apm;
