'use strict';

const defaults = require('@idearium/log/defaults');
const err = require('./err');
const req = require('./req');
const res = require('./res');

module.exports = Object.assign({}, defaults, {
    serializers: {
        err,
        req,
        res
    }
});
