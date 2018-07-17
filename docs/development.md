# Development

## Requirements

To program, test and publish these libraries, you will need:

- Docker (Docker for mac)
- Git

__Please note:__ this has only been tested on Mac OS X environments.

## Updating packages

In order to update packages, you will need to use `Yarn` and run:

```shell
$ yarn add ...
```

This will update the yarn.lock file that is used in testing.

## Testing

This library is tested by Codefresh, which employs a Docker-driven test environment. As such, testing locally also follows this approach.

To run the tests:

```shell
$ yarn test
```

## Publishing

In order to publish this library, first update the `CHANGELOG.md` with the new version and commit the change. Then run:

```shell
$ yarn version
yarn version v1.7.0
info Current version: 1.0.0
question New version: <enter the new version number>
info New version: <the new version number>
✨  Done in 66.74s.

$ git push --follow-tags
```

## Structure

### Common

Common files all require config and are dependent on other files within idearium-lib.
They should not export classes where possible.

### Lib

Lib files work independant of each other and are used by the common files.
