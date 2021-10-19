# @idearium/log-http

## Unreleased

## v1.0.2-beta.1 - 2021-10-19

### Changed

-   Updated to latest version of @idearium/log.

### Fixed

-   Fixed Jest tests.

## v1.0.1-beta.7 - 2021-07-31

### Changed

-   Updated responseTime to log in seconds rather than milliseconds.

## v1.0.1-beta.6 - 2021-07-30

### Fixed

-   Fixed server error middleware.

## v1.0.1-beta.5 - 2021-06-11

### Fixed

-   Fixed potential XSS issue.

## v1.0.1-beta.4 - 2021-06-11

### Changed

-   Where the middleware files are.

### Added

-   404 middleware.
-   500 middleware to send the error to the client.

## v1.0.1-beta.3 - 2021-06-11

### Fixed

-   Updated the log level to ERROR when a log occurs during the request/response lifecycle.

## v1.0.1-beta.2 - 2021-06-11

### Added

-   Support for supplying additional context when an error is produced.

## v1.0.1-beta.1 - 2021-06-11

### Added

-   Added an `err` serializer.
-   Added some error handling middleware.

## v1.0.1 - 2021-09-17

### Changed

-   Version bump pino-http to v5.7.0.

## v1.0.0 - 2021-06-08

-   Added pino-http as a dependency.
-   Fixed issues with tests.
-   First version of the package.
