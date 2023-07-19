const safePromise = require('@idearium/safe-promise');

const safeBatchProcess = async ({ batch, process }) => {
    const [err] = await safePromise(process(batch));

    if (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to process batch', err);
        return batch.retryAll();
    }

    // eslint-disable-next-line no-console
    console.log('Processed batch');
    batch.ackAll();
};

const safeMessageProcess = async ({ message, process }) => {
    const [err] = await safePromise(process(message));

    if (err) {
        // eslint-disable-next-line no-console
        console.error(`Failed to process message ${message.id}`, err);
        return message.fail();
    }

    // eslint-disable-next-line no-console
    console.log(`Processed message ${message.id}`);
    message.ack();
};

module.exports = {
    safeBatchProcess,
    safeMessageProcess,
};
