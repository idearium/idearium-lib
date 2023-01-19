const {
    getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { PinoInstrumentation } = require('@opentelemetry/instrumentation-pino');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const rename = require('./rename');

const instrumentations = ({ ignoreIncomingPaths = [/\/_status\/ping/] } = {}) =>
    registerInstrumentations({
        instrumentations: [
            getNodeAutoInstrumentations({
                '@opentelemetry/instrumentation-http': {
                    ignoreIncomingPaths,
                },
            }),
            new PinoInstrumentation({
                logHook: (span, object) => rename(object),
            }),
        ],
    });

module.exports = instrumentations;
