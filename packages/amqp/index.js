import { connect } from './lib/connect.js';
import { consumeFactory } from './lib/consume.js';
import { createConsumer } from './lib/consumer.js';
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

export { createConsumer, createPublisher };
