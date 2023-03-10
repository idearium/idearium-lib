# @idearium/certs

## Unreleased

### Fixed

-   Won't error if the ca directory doesn't exist.

## v2.0.0-beta.2 - 2023-03-09

### Changed

-   Refactored the tests to use a mock per test.

## v2.0.0-beta.1 - 2023-03-09

### Changed

**Please note**: these are all breaking changes.

-   Renamed `loadProvidedCerts` to `loadCerts`.
-   Renamed `loadAllCerts` to `loadOsCerts`.
-   Reduced the scope of `loadOsCerts` to only loading OS provided certificates (it will no longer update `https.globalAgent.options.ca` with those certs either).
-   `loadCerts` now looks for CA certs within a `ca` directory, relative to the path provided to the functions.
-   `loadCerts` will now load crt and key pairs (or individual files) found directly within the directory provided to it.

## v1.0.0 - 2023-01-25

-   First version of the package.
