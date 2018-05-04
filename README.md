# idearium-lib

[![Codefresh build status]( https://g.codefresh.io/api/badges/build?repoOwner=idearium&repoName=idearium-lib&branch=master&pipelineName=idearium-lib&accountName=smebberson&type=cf-1)]( https://g.codefresh.io/repositories/idearium/idearium-lib/builds?filter=trigger:build;branch:master;service:58d45bc80d3ba3010087a0a8~idearium-lib)

This repository contains `idearium-lib`, which is a Node.js shared library for Idearium applications running on Node.js. Any code that is used across multiple applications (or within multiple Docker containers) should live here.

The following documents the development environment, read [idearium-lib/README.md](idearium-lib/README.md) for information on the library itself.

## Requirements

To program, test and publish these libraries, you will need:

- Vagrant.
- VMWare Fusion (and Vagrant-VMware provider plugin) or Virtualbox.
- Vagrant Host Manager plugin (execute `vagrant plugin install vagrant-hostmanager` to install).
- Git.

__Please note:__ this has only been tested on Mac OS X environments.

## Getting started with development

Follow these steps to setup the VM:

- [Host]    `cd` into the directory containing this Git repository.
- [Host]    Execute `vagrant up` to have Vagrant create a virtual machine.

With the VM started, update it to the latest setup (including a kernel update which is important for Docker):

- [Host]    Execute `vagrant ssh` to be provided with a bash shell within the virtual machine.
- [Guest]   Setup NPM the test environment with `lib-test-setup`.

## Testing

This library is tested by Codefresh, which employs a Docker-driven test environment. As such, testing from the VM also follows this approach.

Using the `lib-test-setup` and `lib-test` scripts, Docker and Docker Compose are used to bring up an environment suitable for testing (one that includes RabbitMQ) and tests are run via `npm test` inside a running Docker image.

This repository has a complete test suite, which can be run by:

- [Host]    Execute `vagrant ssh` to be provided with a bash shell within the virtual machine.
- [Guest]   If you've only just restarted the virtual machine, execute `dc up -d`.
- [Guest]   Then you can execute `lib-test` to run the tests, as many times as you need.

### Online unit tests

Every commit and push of this repository is tested by Codefresh, https://g.codefresh.io/repositories/idearium/idearium-lib.

### Accessing NPM

If you want to run any other NPM command within the context of the container:

- [Host]    Execute `vagrant ssh` to be provided with a bash shell within the virtual machine.
- [Guest]   If you've only just restarted the virtual machine, execute `dc up -d`.
- [Guest]   Execute `lib-test {npm-command}` to run an NPM command. For example, `lib-test whoami` to run `npm whoami` within the context of `./idearium-lib` within the container.

## Logging into NPM

In order to publish this package to NPM, you need to log into NPM to provide authentication details. Follow these steps:

- [Host]    Execute `vagrant ssh` to be provided with a bash shell within the virtual machine.
- [Guest]   Execute `npm login` and follow the prompts.

Each Idearium developer should have their own NPM account, that is a member of the `@idearium` organisation.
Now you have everything required to start coding and testing.

## APM

In order to setup apm you will need to add the following to your project:

```javascript
// @ app/lib/apm.js

'use strict';

module.exports = require('@idearium/idearium-lib/common/apm');

// @ server.js
'use strict';

require('./lib/apm');

...

// @ app.js
'use strict';

const apmLib = require('./lib/apm');
const { apm } = require('../lib/middleware');

// Before other middleware
linz.app.use(apm);

...

// Before other error middleware
linz.app.use(apmLib.middleware.connect());

...
```

At a minimum, you must add the following environment variables:

```shell
# Your Elastic APM service name.
ELASTIC_APM_SERVICE_NAME

# The secret token optionally expected by the APM Server.
ELASTIC_APM_SECRET_TOKEN

# The URL to where the APM Server is deployed.
ELASTIC_APM_SERVER_URL
```

More settings can be found in the APM docs: [Agent API](https://www.elastic.co/guide/en/apm/agent/nodejs/current/agent-api.html)
