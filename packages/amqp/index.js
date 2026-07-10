import { connect } from './lib/connect.js';
import { consumeFactory } from './lib/consume.js';
import { createPublisher } from './lib/publisher.js';
import { publishFactory } from './lib/publish.js';

export const createClient = async ({
    mqUrl,
    tlsOptions,
    ...sessionOptions
}) => {
    const session = await connect({ mqUrl, tlsOptions, ...sessionOptions });
    const { consume } = consumeFactory({ session });
    const { publish } = publishFactory({ session });

    return {
        consume,
        publish,
        session,
        stop: (reason) => session.stop(reason),
    };
};

export const createConsumer = async ({
    mqUrl,
    tlsOptions,
    consumer,
    durable = true,
    exchange,
    name,
    noAck = false,
    queue,
    routingKey,
    type = 'topic',
    ...sessionOptions
}) => {
    const session = await connect({ mqUrl, tlsOptions, ...sessionOptions });
    const { consume } = consumeFactory({ session });

    const result = await consume({
        consumer,
        durable,
        exchange,
        name,
        noAck,
        queue,
        routingKey,
        type,
    });

    return {
        ...result,
        stop: (reason) => session.stop(reason),
    };
};

export { createPublisher };
