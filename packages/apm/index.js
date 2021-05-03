'use strict';

const apm = require('elastic-apm-node');

let active = process.env.ELASTIC_APM_ACTIVE;
const ignoreUrls = (process.env.ELASTIC_APM_IGNORE_URLS || '').split(',');

if (typeof active === 'undefined') {
    active = process.env.NODE_ENV === 'production';
}

apm.start({
    active,
    ignoreUrls: ['/_status/ping', '/version.json', ...ignoreUrls]
});

module.exports = apm;
