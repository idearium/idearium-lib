---
id: telemetry
title: '@idearium/telemetry'
---

The Idearium Open Telemetry implementation.

## Installation

```shell
$ yarn add @idearium/telemetry
```

## Usage

```Shell
node --require @idearium/telemetry server.js
```

### Configuration

You must have a few environment variables present in order for this package to do anything:

-   `TARGET_ENV` must be set to something other than `local`.
-   `TRACE_EXPORTER_ACCOUNT_EMAIL` must be set to the email of a service account on Google Cloud.
-   `TRACE_EXPORTER_ACCOUNT_SECRET` must be set to the private key of a service account on Google Cloud.
-   `TRACE_EXPORTER_PROJECT_ID` must be set to a Project ID on Google Cloud.

You can also have the following optional environment variables:

-   `OPENTELEMETRY_DEBUG` set to `'true'` if you want to enable Open Telemetry debugging output in the console.
