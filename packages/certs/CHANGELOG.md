# @idearium/certs

## Unreleased

## v2.0.0 - 2023-03-20

### Changed

**Please note**: these are all breaking changes.

-   Renamed `loadProvidedCerts` to `loadCerts`.
-   Renamed `loadAllCerts` to `loadOsCerts`.
-   Reduced the scope of `loadOsCerts` to only loading OS provided certificates (it will no longer update `https.globalAgent.options.ca` with those certs either).
-   `loadCerts` now looks for CA certs within a `ca` directory, relative to the path provided to the functions.
-   `loadCerts` will now load crt and key pairs (or individual files) found directly within the directory provided to it.

## v1.0.0 - 2023-01-25

-   First version of the package.
