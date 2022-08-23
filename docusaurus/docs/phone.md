---
id: phone
title: '@idearium/phone'
---

Wrapper around the Twilio phone lookup api.

## Installation

```shell
$ yarn add -E @idearium/phone
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/phone@beta
```

## Usage

To use `@idearium/phone`, simply call the exported `parsePhoneNumber` function.
This function takes a phone number string and attempts to format it into the E.164 phone number format.

You will need to include the following environment variables in your manifests:

```yaml
TWILIO_ACCOUNT_SID: 'accountsid'
TWILIO_AUTH_TOKEN: 'authtoken'
```
