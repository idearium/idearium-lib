'use strict';

const { Transform } = require('stream');

const write = (callback, line) => {
    if (typeof line === 'string' || Buffer.isBuffer(line)) {
        return callback(null, `${line.toString()}`);
    }

    return callback(null, `${JSON.stringify(line)}\n`);
};

const createHttpRequest = (req, res) => ({
    protocol: req.protocol,
    referer: req.headers.referer || '',
    remoteIp:
        req.headers['x-forwarded-for'] ||
        // This is for < v13
        req.remoteIp ||
        // This is for > v14
        '',
    requestMethod: req.method,
    requestSize: req.headers['content-length'] || 0,
    requestUrl: req.url,
    responseSize: res.size || 0,
    status: res.statusCode,
    userAgent: req.headers['user-agent'] || ''
});

const transformErroredRequest = (log) => {
    const { err, req, res } = log;

    const updated = Object.assign({}, log, {
        '@type': err['@type'],
        'context': { httpRequest: createHttpRequest(req, res) },
        'exception': err.message
    });

    delete updated.err;

    return updated;
};

const transformRequest = (log) => {
    const updated = Object.assign({}, log);
    const { req, res } = updated;

    updated.httpRequest = createHttpRequest(req, res);

    return updated;
};

const parse = (input) => {
    try {
        return JSON.parse(input);
    } catch (e) {
        return input;
    }
};

module.exports = () => {
    return new Transform({
        decodeStrings: true,
        defaultEncoding: 'utf8',
        objectMode: true,
        transform(data, enc, callback) {
            const line = parse(data);

            if (typeof line === 'string') {
                return write(callback, data);
            }

            // It was JSON, but there was no req or res.
            // Write back the exact same line we received, not the passed version.
            if (!(line.req && line.res)) {
                return write(callback, data);
            }

            if (line.err && line.req && line.res) {
                return write(callback, transformErroredRequest(line));
            }

            return write(callback, transformRequest(line));
        }
    });
};
