# @idearium/amqp

## Unreleased

## v2.0.0-beta.1

- Switched from `amqplib` to `@cloudamqp/amqp-client` 4.0.0
- New high-level API with automatic reconnection and consumer recovery
- Uses `@cloudamqp/amqp-client`'s built-in JSON codec (`builtinParsers`) for automatic message serialization and deserialization
- Converted from CJS to ESM (`"type": "module"`)
- Replaced Jest with Vitest (no globals)
- **Breaking:** `module.exports = amqp` changed to ESM named exports `createClient`, `createPublisher`, `createConsumer`
- **Breaking:** CJS consumers can no longer `require('@idearium/amqp')` -- must use `import` (ESM)
- **Breaking:** Positional params changed to single object params
- **Breaking:** `autoAck` removed; use `noAck` (default `false`) for acknowledgment control
- **Breaking:** Consumer errors are no longer swallowed -- messages are now nacked and requeued per `@cloudamqp/amqp-client` v4 defaults (previously errors were caught, logged, and the message was acked/lost)
- **Breaking:** Minimum Node.js 18
- Preserved: `process.env.MQ_URL` default for `mqUrl` (callers can omit `mqUrl` when the env var is set)
- Added validation: `publish` and `createPublisher` now throw when `exchange` or `data` is missing
- Removed unused dependencies (`@idearium/certs`, `@idearium/promise-all-settled`, `@idearium/safe-promise`)

## v1.0.0 - 2023-03-20

- First version of the package.
