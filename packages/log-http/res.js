'use strict';

module.exports = (res) => {
    const { headers, statusCode } = res;

    return {
        headers,
        // eslint-disable-next-line no-underscore-dangle
        size: res.raw._contentLength || 0,
        statusCode
    };
};
