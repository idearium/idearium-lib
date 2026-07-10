import { AMQPSession, builtinParsers } from '@cloudamqp/amqp-client';
import createLog from '@idearium/log';

const log = createLog();

const redactUrl = ({ url }) => {
    const [protocol, remainder] = url.split('://');

    if (!remainder) {
        return url;
    }

    let host = remainder;

    if (host.includes('@')) {
        [, host] = remainder.split('@');
    }

    return `${protocol}://${host}`;
};

export const connect = async ({
    mqUrl = process.env.MQ_URL,
    tlsOptions,
    ...sessionOptions
}) => {
    if (!mqUrl) {
        throw new Error('mqUrl parameter is required');
    }

    const url = redactUrl({ url: mqUrl });

    log.info({ url }, 'Connecting to AMQP server.');

    const session = await AMQPSession.connect(mqUrl, {
        tlsOptions,
        parsers: builtinParsers,
        defaultContentType: 'application/json',
        onconnect: () => {
            log.info({ url }, 'Connected to AMQP server.');
        },
        ondisconnect: (err) => {
            log.warn({ err, url }, 'Connection lost; attempting to reconnect.');
        },
        onfailed: (err) => {
            log.error({ err, url }, 'Reconnection to the AMQP server failed.');
        },
        ...sessionOptions,
    });

    return session;
};
