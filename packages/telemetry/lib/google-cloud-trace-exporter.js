const {
    TraceExporter,
} = require('@google-cloud/opentelemetry-cloud-trace-exporter');

const exporter = ({ clientEmail, privateKey, projectId }) =>
    new TraceExporter({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
        projectId,
    });

module.exports = exporter;
