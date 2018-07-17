# APM

In order to setup apm you will need to add the following to your project:

```javascript
// @ app/lib/apm.js

'use strict';

const apm = require('@idearium/idearium-lib/common/apm').start();

module.exports = apm;

// @ server.js
'use strict';

require('./lib/apm');

...

// @ app.js
'use strict';

const apm = require('./lib/apm');

// Before other error middleware
linz.app.use(apm.middleware.connect());

...
```

You can also customise the exception handler by adding your own `exceptionHandler` property:
```javascript
'use strict';

const apm = require('@idearium/idearium-lib/common/apm').start({
    exceptionHandler: (err) => {
        // Your code
    },
});

module.exports = apm;
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
