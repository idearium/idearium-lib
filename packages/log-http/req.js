'use strict';

module.exports = (req) => {
    const {
        headers,
        id,
        method,
        params,
        query,
        raw,
        remoteAddress,
        remotePort,
        url
    } = req;

    return {
        headers,
        id,
        method,
        params,
        protocol: `http/${raw.httpVersion}`,
        query,
        remoteAddress,
        remoteIp:
            raw.headers['x-forwarded-for'] ||
            // This is for < v13
            (raw.connection && raw.connection.remoteAddress) ||
            // This is for > v14
            (raw.socket && raw.socket.remoteAddress),
        remotePort,
        url
    };
};
