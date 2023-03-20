const amqp = require('amqplib');
const safePromise = require('@idearium/safe-promise');
const log = require('@idearium/log')();

const redactUrl = (url) => {
    const [protocol, remainder] = url.split('://');
    let host = remainder;

    if (host.includes('@')) {
        [, host] = remainder.split('@');
    }

    return `${protocol}://${host}`;
};

module.exports = async (mqUrl, opts = {}) => {
    let state = 'disconnected';

    if (!mqUrl) {
        throw new Error('mqUrl parameter is required');
    }

    const url = redactUrl(mqUrl);

    log.info({ url }, 'Connecting to AMQP server.');

    state = 'connecting';

    const [err, connection] = await safePromise(amqp.connect(mqUrl, opts));

    if (err) {
        log.error({ err, url }, 'Could not connect to AMQP server.');

        throw err;
    }

    state = 'connected';

    log.info({ url }, 'Connected to AMQP server.');

    // This needs to be async so that the throw causes Node.js to exit.
    connection.on('close', async (connectionErr) => {
        state = 'disconnected';

        log.error(
            { err: connectionErr, url },
            'Connection to the AMQP server closed.'
        );

        // This didn't wor for some reason?
        throw new Error('The connection to the AMQP server closed.');
    });

    connection.isConnected = () => state === 'connected';

    return connection;
};
