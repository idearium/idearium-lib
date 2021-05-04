# @idearium/log

## v1.0.0-beta.4 - 2021-05-04

-   Deprecated the use of `require-main-filename`.
-   `context` now uses `__dirname` and `__filename`.

## v1.0.0-beta.3 - 2021-05-04

-   Added `severity` to support [GCP structured logging](https://cloud.google.com/logging/docs/structured-logging).
-   Updated `time` to support [GCP structured logging](https://cloud.google.com/logging/docs/structured-logging).

## v1.0.0-beta.2 - 2021-05-04

-   Dependency upgrades.
-   Deprecated `insightops` from this package (see @idearium/log-insightops).
-   Deprecated `LOG_REMOTE`.
-   Renamed `PINO_PRETTY_PRINT` to `LOG_PRETTY_PRINT`.
-   Renamed `PINO_REDACT_PATHS` to `LOG_REDACT_PATHS`.
-   Pretty printing now needs to be explicitly enabled.

## v1.0.0-beta.1

-   First version of the package.
