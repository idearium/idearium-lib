'use strict';

const { context, trace, isSpanContextValid } = require('@opentelemetry/api');
const onHeaders = require('on-headers');

/* eslint-disable no-invalid-this */
// eslint-disable-next-line func-style, require-jsdoc
function addTraceId() {
    if (!this.getHeader('x-trace-id')) {
        const span = trace.getSpan(context.active());

        if (!span) {
            return;
        }

        const spanContext = span.spanContext();

        if (!isSpanContextValid(spanContext)) {
            return;
        }

        this.setHeader('x-trace-id', spanContext.traceId);
    }
}
/* eslint-enable no-invalid-this */

const traceIdMiddleware = (req, res, next) => {
    onHeaders(res, addTraceId);

    return next();
};

module.exports = traceIdMiddleware;
