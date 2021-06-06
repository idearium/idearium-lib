'use strict';

const { wrapRequestSerializer } = require('pino-std-serializers');

module.exports = wrapRequestSerializer((req) => {
    const { raw, url } = req;

    return {
        protocol: `http/${raw.httpVersion}`,
        referer: raw.headers.referer || '',
        remoteIp:
            raw.headers['x-forwarded-for'] ||
            // This is for < v13
            (raw.connection && raw.connection.remoteAddress) ||
            // This is for > v14
            (raw.socket && raw.socket.remoteAddress),
        requestMethod: raw.method,
        requestParams: req.params || '',
        requestQuery: req.query || '',
        requestSize: raw.headers['content-length'] || 0,
        requestUrl: url,
        userAgent: raw.headers['user-agent'] || ''
    };
});
