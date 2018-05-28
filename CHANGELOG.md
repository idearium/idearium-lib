# idearium-lib

This file is a history of the changes made to idearium-lib.

## v1.0.0-alpha.34 (25 May 2018)

- Updated apm to allow custom `unhandledRejection` and `apm.handleUncaughtExceptions` exception handlers. Just set `apm.exception = () => { ... }` in the app.
- Updated the default exception handler to call `log.error` instead of just console.log.

## v1.0.0-alpha.33 (18 May 2018)

- Updated apm to use environment variables only.

## v1.0.0-alpha.32 (17 May 2018)

- Added a default APM server route.
- Updated the default ping url to be `/_status/ping`.

## v1.0.0-alpha.31 (16 May 2018)

- Removed the use of Loader when generated `module.exports` objects in `lib`.

## v1.0.0-alpha.30 (14 May 2018)

- Fixed errors not being logged to console.
- Fixed unhandled promises not stopping the node process.

## v1.0.0-alpha.29 (4 May 2018)

- Fix apm.setUserContext is not a function error.

## v1.0.0-alpha.28 (4 May 2018)

- Replaced Opbeat with Elastic APM.
- Added an Elastic APM usage guide.

## 1.0.0-alpha.27

- Updated `lib.emailServices.Mandrill` to support the `sendAt` property.
- Refactored the name of `lib.emailServices.Mandrill` class to be `Mandrill` rather than `MandrillService`.

## 1.0.0-alpha.26

- Disabled OPBEAT when in test mode.

## 1.0.0-alpha.25

- Added a new `Api` class to help generate consistent REST apis.

## 1.0.0-alpha.24

- Improve error handling with `lib.util.parseCsv`.

## 1.0.0-alpha.23

- Update `common/mq/publisher` to log error messages.

## 1.0.0-alpha.22

- Update `mq.Manager().publish` to pass on a `Promise` if one was returned from the `message.publish` function, otherwise return `Promise.resolve()` by default.
- Update `mq.Client().publish` to return a `Promise`.
- Update `common/mq/publisher` to return a `Promise`.

## 1.0.0-alpha.21

- Fixed a typo in `mq.connection`. Changed `Promise.resolved` to `Promise.resolve`. Added a test case specific for this.

## 1.0.0-alpha.20

- Refactored the query methods to allow all query `conditions` and `options`. i.e. you can now pass in `limit` through the `options` object rather than adding a query chain method `.limit()`.

## 1.0.0-alpha.19

- Add the `common/crypto` library, and tests.

## 1.0.0-alpha.18

- Added new `util.parseCsv(data, options)` method. This can be used to parse a csv and takes a readable stream or buffered data contents as the first parameter. You can also transform the csv contents using an `options.transform` function or use any options listed here http://csv.adaltas.com/parse/.

## 1.0.0-alpha.17

- Removed `processJobs` from `common/kue.js`.
- `common/kue-queue.js` will now throw an error if `!config.get('kuePrefix')`.
- Added `util.parseCsv` method to parse csvs as a buffer or stream.

## 1.0.0-alpha.16

- Split `common/mongodb` into two files `common/mongo/certs` and `common/mongo/connection`.
- `common/mongo/certs` will now load CA (only) certs from a directory structure that matches `common/mq/certs`.

## 1.0.0-alpha.15

- Add `MandrillEmail` to common.
- Replace `kue.process` with `kue.processJobs`. This now automates processing all jobs in the `jobs` directory.

## 1.0.0-alpha.14

- Simplified `common/exception` now that Opbeat should become standard practice.
- Added a `query` file to help create performant queries.
- Added `kue` and `queue` to the common files.

## 1.0.0-alpha.13

- Fix `Publisher` class.

## 1.0.0-alpha.12

- Added `Logger` instance to the common folder.
- Added new `util` to the library.
- Added new `mongodb` to the common folder.
- Added new `publisher` to the common folder.
- Added new `opbeat` to the common folder.
- Added new `session` to the common folder.
- Deprecated `utils` in favour of the new `util`. This also acts as a wrapper around the build in node `util` module.

## 1.0.0-alpha.11

- Large refactoring of the `mq.Connection` class.
- Large refactoring of the `mq.Client` class.

## 1.0.0-alpha.10

*Note:* this version is highly unstable. Don't use it :(

- **Breaking change**: `mq.Client().consume` now expects a Promise to be returned.
- `mq.Client().publish` now expects a Promise to be returned.
- The connection based code from `mq.Client` has been moved out into `mq.Connection`.
- The certificate loading code from `common/mq/client` has been moved out into `common/mq/certs`.
- Refactored `mq.Client` to make better use of Promises.
- Refactored `mq.Manager` to make better use of Promises.
- `mq.RpcServer` and `mq.RpcClient` have been created to facilitate RPC based messaging.

## 1.0.0-alpha.8

- You can now use `config.get('env')` to retrieve the value of `process.env.NODE_ENV`.
- `common/mq/client` is now `process.env.NODE_ENV` aware and will load SSL certs if they exist in the `mq-certs/{process.env.NODE_ENV}` directory.
- `common/mq/client` will now load certificate and key files separate to CA files. The loading of CA files is no longer dependent on a certificate and key file being present.
- `common/mq/client` now sets the `servername` option to better support SSL based connections.

## 1.0.0-alpha.7

- `common/mq/client` will now load SSL certs if they exist.

## 1.0.0-alpha.6

- Added the `Email` class and passing tests.
- Added the `emailServices` package.
- Added the `emailServices.Mandrill` class.
- Added the `Hash` class and passing tests.

## 1.0.0-alpha.5

- Improved `middleware.logRequest` and added a passing test case.

## 1.0.0-alpha.4

- Added the `common/exception`.
- Added the `middleware` package with `middlware.configSettings`, `middlware.logError` and `middlware.logRequest`.

## 1.0.0-alpha.3

- Added the `utils` package.

## 1.0.0-alpha.2

### Breaking changes

- Will no longer read environment specific configuration files such as `config.development.json` or `config.production.json`.

### Features

- Updated to a more simple `config` directory format. It will now only attempt to load one file `./config/config.js`. This file should contain defaults setup for the `development` environment. All other environment specific configuration changes should be made through ENV variables.

## 1.0.0-alpha.1

Initial commit of the library, based off `focusbooster-lib`.
