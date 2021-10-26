'use strict';

const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');

const { Resource } = require('@opentelemetry/resources');
const {
    SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

const createProvider = ({ exporter }) => {
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: process.env.SVC || '',
        }),
    });

    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register();

    return provider;
};

module.exports = createProvider;
