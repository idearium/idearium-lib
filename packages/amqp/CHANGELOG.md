# @idearium/amqp

## Unreleased

## v1.1.0 - 2026-10-08

- Added `publishToTopic` (at `lib/publish-to-topic.js`): one-shot publish to a durable topic exchange with confirmed delivery; `mandatory` option (default `true`) throws when the broker returns the message unroutable; always closes its connection. Ported from ras-mms. Connect retries are not included — the caller's orchestration (e.g. Kubernetes CronJob backoff) owns them.
- `publishToTopic` works with either `amqplib` or `@cloudamqp/amqp-client`, using whichever is installed (`amqplib` preferred when both are present). Both are optional peer dependencies — the host application must install one of them. The rest of the package (`index.js`, `lib/connect.js`, `lib/publish.js`) still requires `amqplib` to be installed.

## v1.0.0 - 2023-03-20

- First version of the package.
