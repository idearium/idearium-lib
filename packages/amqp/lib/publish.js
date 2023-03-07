const multiLog = require('@idearium/log/multi')();

const publishingChannels = {};

const bufferAsJson = (buffer) => {
    let result = '<buffer>';

    try {
        result = JSON.parse(buffer.toString());
    } catch (e) {
        // Ignore the error and just return '<buffer>'
    }

    return result;
};

const channels = (connect) => {
    const setupDrain = async ({ exchange, name, routingKey, type }) => {
        // eslint-disable-next-line no-use-before-define
        const channel = await get(name);

        if (!channel.drain) {
            channel.drain = true;
            multiLog(
                {
                    debug: { type },
                    info: { exchange, name, routingKey },
                },
                'Setting up drain queue'
            );
        }
    };

    const republishQueuedMessages = (queueName) => async () => {
        // eslint-disable-next-line no-use-before-define
        const wrapper = await get(queueName);
        const { channel, queue, republish } = wrapper;
        const iterator = queue.values();
        const queuedMsg = iterator.next().value;
        const { data, exchange, publishOpts, name, routingKey, type } =
            queuedMsg;

        multiLog(
            {
                debug: { data: bufferAsJson(data), type },
                info: { exchange, name, routingKey },
            },
            'Publishing a queued message'
        );

        const published = channel.publish(
            exchange,
            routingKey,
            data,
            publishOpts
        );

        // Always delete, as amqplib will buffer anyway and we don't want to publish this again.
        queue.delete(queuedMsg);

        if (!published) {
            setupDrain({ exchange, name, routingKey, type });
        }

        // If there is more in the queue, publish it.
        if (published && queue.size) {
            setTimeout(() => republish(), 0);
        }

        // If the queue is empty, remove the drain on this queue.
        if (published && !queue.size) {
            wrapper.drain = false;
            multiLog(
                {
                    debug: { type },
                    info: { exchange, name, routingKey },
                },
                'Emptied drain queue'
            );
        }
    };
    const set = async (name) => {
        const republish = republishQueuedMessages(name);

        // This is to avoid a race condition in setting up publishing channels.
        publishingChannels[name] = new Promise((resolve) => {
            connect().then(async (connection) => {
                const channelPromise = connection.createChannel();

                const channel = await channelPromise;

                channel.on('drain', republish);

                return resolve({
                    channel,
                    drain: false,
                    queue: new Set(),
                    republish,
                });
            });
        });

        return publishingChannels[name];
    };

    const get = async (name) => {
        if (!publishingChannels[name]) {
            await set(name);
        }

        return publishingChannels[name];
    };

    const publish = async (name, data, options) => {
        const {
            durable = true,
            exchange,
            routingKey,
            type = 'topic',
            ...publishOpts
        } = options;

        const { channel, drain, queue } = await get(name);

        await channel.assertExchange(exchange, type, {
            durable,
        });

        const dataAsBuffer = Buffer.isBuffer(data)
            ? data
            : Buffer.from(JSON.stringify(data));

        if (drain) {
            multiLog(
                {
                    debug: { data: bufferAsJson(data), type },
                    info: { exchange, name, routingKey },
                },
                'Queuing a message for publishing'
            );

            return queue.add({
                exchange,
                data: dataAsBuffer,
                durable,
                publishOpts,
                name,
                routingKey,
                type,
            });
        }

        multiLog(
            {
                debug: { data: bufferAsJson(data), type },
                info: { exchange, name, routingKey },
            },
            'Publishing a message'
        );

        const published = channel.publish(
            exchange,
            routingKey,
            dataAsBuffer,
            publishOpts
        );

        if (!published) {
            setupDrain({
                exchange,
                name,
                routingKey,
                type,
            });
            queue.add({
                exchange,
                data: dataAsBuffer,
                durable,
                publishOpts,
                name,
                routingKey,
                type,
            });
        }
    };

    return { publish };
};

module.exports = channels;
