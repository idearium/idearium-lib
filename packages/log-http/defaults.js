'use strict';

const defaults = require('@idearium/log/defaults');
const err = require('./err');
const req = require('./req');
const res = require('./res');
const responseTime = require('./response-time');

module.exports = Object.assign({}, defaults, {
    customLogLevel(response) {
        return response.statusCode >= 500 ? 'error' : 'info';
    },
    serializers: {
        err,
        req,
        res,
        responseTime,
    },
});
