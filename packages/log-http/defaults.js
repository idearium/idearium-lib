'use strict';

const defaults = require('@idearium/log/defaults');
const req = require('./req');
const res = require('./res');

module.exports = Object.assign({}, defaults, {
    serializers: {
        req,
        res
    }
});
