# @idearium/log-http

## Unreleased

## v1.0.2 - 2021-10-19

### Changed

-   Updated to latest version of @idearium/log.
-   Where the middleware files are.
-   Updated responseTime to log in seconds rather than milliseconds.

### Fixed

-   Updated the log level to ERROR when a log occurs during the request/response lifecycle.
-   Fixed server error middleware.

### Added

-   404 middleware.
-   500 middleware to send the error to the client.
-   Support for supplying additional context when an error is produced.
-   Added an `err` serializer.
-   Added some error handling middleware.

## v1.0.1 - 2021-09-17

### Changed

-   Version bump pino-http to v5.7.0.

## v1.0.0 - 2021-06-08

-   Added pino-http as a dependency.
-   Fixed issues with tests.
-   First version of the package.
