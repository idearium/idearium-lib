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
This function takes a `countryCode` and `phoneNumber` string and attempts to format it into the E.164 phone number format.

Example:

```js
const { parsePhoneNumber } = require('@idearium/phone');

await parsePhoneNumber({ countryCode: 'AU', phoneNumber: '0412345678' });

// {
//   "addOns": null,
//   "callerName": null,
//   "carrier": null,
//   "countryCode": "AU",
//   "nationalFormat": "0412 345 678",
//   "phoneNumber": "+61412345678",
//   "url": "https://lookups.twilio.com/v1/PhoneNumbers/+61412345678"
// }
```

You will need to include the following environment variables in your manifests:

```yaml
TWILIO_ACCOUNT_SID: 'accountsid'
TWILIO_AUTH_TOKEN: 'authtoken'
```
