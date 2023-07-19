---
id: cloudflare-queues
title: '@idearium/cloudflare-queues'
---

Safely process Cloudflare Queues batches and messages.

## Installation

```shell
$ yarn add -E @idearium/cloudflare-queues
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/cloudflare-queues@beta
```

## Usage

Use `@idearium/cloudflare-queues` to safely process both batches and individual messages.

### Process batches

This shows an example of a Cloudflare Worker that processes the entire batch of messages at once.

```js
import { safeBatchProcess } from '@idearium/cloudflare-queues';

export default {
    async queue(messageBatch, env) {
        await safeBatchProcess({
            process: async (batch) => {
                await Promise.all(
                    batch.messages.map(({ body }) => Promise.resolve(body))
                );
            },
            batch: messageBatch,
        });
    },
};
```

### Process messages

This shows an example of a Cloudflare Worker that hands off to a function that processes each message individually.

```js
// lib/consume.js
import { safeMessageProcess } from '@idearium/cloudflare-queues';

export const consume = async (queueMessage) =>
    safeMessageProcess({
        message: queueMessage,
        process: async (message) => Promise.resolve(message.body),
    });
```

```js
// worker.js
import { consume } from './lib/consume.js';

export default {
    async queue(batch, env) {
        await Promise.allSettled(batch.messages.map(consume));
    },
};
```

## Functions

You can process entire batches of messages or each individual message. If you process an entire batch and they all fail, the entire batch will be retried. If you process each message individually, only those messages that fail will be retried. Read more about [explicit acknowledgement](https://developers.cloudflare.com/queues/learning/batching-retries/#explicit-acknowledgement) and [retries](https://developers.cloudflare.com/queues/learning/batching-retries/#retries).

### safeBatchProcess

`safeBatchProcess` expects an object with the following properties:

-   `process`: A function that processes the batch.
-   `batch`: The batch to process.

`safeBatchProcess` will call the `process` function provided to it and pass the batch as the only argument.

`safeBatchProcess` returns a promise that resolves when the batch has been processed. It will also call [`batch.ackAll()` to acknowledge the batch](https://developers.cloudflare.com/queues/platform/javascript-apis/#messagebatch).

If the batch cannot be processed, the promise will reject with an error. It will also call [`batch.retryAll()` to reject the batch](https://developers.cloudflare.com/queues/platform/javascript-apis/#messagebatch) so that all messages in the batch will be retried.

### safeMessageProcess

`safeMessageProcess` expects an object with the following properties:

-   `process`: A function that processes the message.
-   `message`: The message to process.

`safeMessageProcess` will call the `process` function provided to it and pass the message as the only argument.

`safeMessageProcess` returns a promise that resolves when the message has been processed. It will also call [`message.ack()` to acknowledge the message](https://developers.cloudflare.com/queues/platform/javascript-apis/#message).

If the message cannot be processed, the promise will reject with an error. It will also call [`message.retry()` to reject the message](https://developers.cloudflare.com/queues/platform/javascript-apis/#message) so that it will be retried.
