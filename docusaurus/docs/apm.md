---
id: apm
title: '@idearium/apm'
sidebar_label: '@idearium/apm'
slug: /apm
---

Defaults for our Elastic APM integration.

## Installation

```shell
$ yarn add -E @idearium/apm
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/apm@beta
```

## Usage

To use `@idearium/apm`, simply require it at the top of your server.js file.

You will need to include the following environment variables in your manifests:

```yaml
ELASTIC_APM_IGNORE_URLS: '/_status/ping,/version.json'
ELASTIC_APM_SERVER_URL: 'https://elasticserverurl:443'
ELASTIC_APM_SERVICE_NAME: 'project-repo-container-environment'
```

## Advanced usage

In addition to the required environment variables above, you can customize the apm integration using any of the [configuration options](https://www.elastic.co/guide/en/apm/agent/nodejs/current/configuration.html).
