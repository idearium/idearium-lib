import createMultiLog from '@idearium/log/multi';

import { connect } from './connect.js';

const multiLog = createMultiLog();

export const createPublisher = async ({
    durable = true,
    exchange,
    mqUrl,
    routingKey,
    tlsOptions,
    type = 'topic',
    ...sessionOptions
}) => {
    if (!exchange) {
        throw new Error('exchange parameter is required');
    }

    if (routingKey === undefined) {
        throw new Error('routingKey parameter is required');
    }

    const session = await connect({ mqUrl, tlsOptions, ...sessionOptions });
    const x = await session.exchange(exchange, type, { durable });

    return {
        publish: async ({ data }) => {
            if (data === undefined) {
                throw new Error('The data parameter must be provided');
            }

            multiLog(
                {
                    debug: { data, type },
                    info: { exchange, routingKey },
                },
                'Publishing a message',
            );

            await x.publish(data, { routingKey });
        },
        stop: (reason) => session.stop(reason),
    };
};
