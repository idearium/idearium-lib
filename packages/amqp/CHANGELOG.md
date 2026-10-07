# @idearium/amqp

## Unreleased

- Added `publishToTopic` (at `lib/publish-to-topic.js`): one-shot publish to a durable topic exchange with confirmed delivery; `mandatory` option (default `true`) throws when the broker returns the message unroutable; always closes its connection. Ported from ras-mms. Connect retries are not included — the caller's orchestration (e.g. Kubernetes CronJob backoff) owns them.

## v1.0.0 - 2023-03-20

- First version of the package.
