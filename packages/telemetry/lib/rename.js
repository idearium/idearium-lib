'use strict';

const mutateRecord = (object) => {
    if (typeof object.span_id !== 'undefined') {
        object.spanId = object.span_id;
        delete object.span_id;
    }

    if (typeof object.trace_flags !== 'undefined') {
        object.traceFlags = object.trace_flags;
        delete object.trace_flags;
    }

    if (typeof object.trace_id !== 'undefined') {
        object.traceId = object.trace_id;
        delete object.trace_id;
    }
};

module.exports = mutateRecord;
