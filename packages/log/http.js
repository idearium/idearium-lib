'use strict';

const pino = require('pino');
const http = require('pino-http');
const defaults = require('./defaults');
const reqSerializer = require('./lib/req');

module.exports = (options = {}) =>
    http(
        Object.assign(
            {},
            defaults,
            {
                formatters: {
                    ...defaults.formatters,
                    log(object) {
                        const { res } = object;

                        return {
                            ...object,
                            httpRequest: {
                                ...JSON.parse(
                                    res.log[
                                        pino.symbols.chindingsSym
                                    ].substring(7)
                                ),
                                responseSize:
                                    res.getHeader('content-length') || 0,
                                status: res.statusCode
                            }
                        };
                    }
                },
                serializers: {
                    req: reqSerializer
                }
            },
            options
        ),
        options.stream || pino.destination(1)
    );
