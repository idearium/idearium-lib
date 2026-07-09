# @idearium/amqp

## Unreleased

- Fixed `publish` not awaiting its inner call so errors propagate and callers can await completion.
- Fixed the publishing channel cache being shared across connections (now scoped per `amqp()` instance), completing the de-singleton refactor.
- Fixed `createChannel` rejection causing the channel cache to hang indefinitely; the cache is now cleared and the error propagated.
- Changed the `'close'` handler to no longer crash the process by default; pass `{ exitOnClose: true }` to opt into the previous crash-on-close behavior. **Breaking.**

## v1.0.0 - 2023-03-20

- First version of the package.
