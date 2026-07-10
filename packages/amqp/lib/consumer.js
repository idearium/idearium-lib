import { connect } from './connect.js';
import { consumeFactory } from './consume.js';

export const createConsumer = async ({
    consumer,
    durable = true,
    exchange,
    mqUrl,
    name,
    noAck = false,
    queue,
    routingKey,
    tlsOptions,
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
