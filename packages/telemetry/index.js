'use strict';

const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
const provider = require('./lib/provider');
const instrument = require('./lib/instrumentations');
const googleCloudTraceExporter = require('./lib/google-cloud-trace-exporter');

/* eslint-disable camelcase,no-process-env */
if (
    process.env.TARGET_ENV !== 'local' &&
    process.env.TRACE_EXPORTER_ACCOUNT_EMAIL &&
    process.env.TRACE_EXPORTER_ACCOUNT_SECRET &&
    process.env.TRACE_EXPORTER_PROJECT_ID
) {
    const clientEmail = process.env.TRACE_EXPORTER_ACCOUNT_EMAIL;
    // I'm not sure why this is required, but it seems the private_key contains an extra slash where it shouldn't.
    const privateKey = process.env.TRACE_EXPORTER_ACCOUNT_SECRET.replaceAll(
        '\\n',
        '\n'
    );
    const projectId = process.env.TRACE_EXPORTER_PROJECT_ID;

    if (process.env.OPENTELEMETRY_DEBUG === 'true') {
        diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
    }

    provider({
        exporter: googleCloudTraceExporter({
            clientEmail,
            privateKey,
            projectId,
        }),
    });
    instrument();
}
/* eslint-enable camelcase,no-process-env */
