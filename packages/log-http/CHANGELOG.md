# @idearium/log-http

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

## v1.0.0 - 2021-06-08

-   Added pino-http as a dependency.
-   Fixed issues with tests.
-   First version of the package.
