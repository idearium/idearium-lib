---
id: date
title: '@idearium/date'
---

Utilities for working with dates and timezones.

## Installation

```shell
$ npm install -E @idearium/date
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ npm install -E @idearium/date@beta
```

## Usage

To use `@idearium/date`, import the functions you need at the top of your file.

`@idearium/date` exports the following:

- `timezoneFromState` - maps an Australian state code to its IANA timezone.
- `formatDateWithTimeZone` - formats a `Date` for a given timezone using `Intl.DateTimeFormat`.
- `zones` - the underlying map of Australian state codes to IANA timezones.

### `timezoneFromState`

Accepts a single-object parameter `{ state }` where `state` is an Australian state code (for example, `NSW`, `VIC`, `QLD`). It is case-insensitive and returns the matching IANA timezone string. Throws if the state is not recognised.

```js
import { timezoneFromState } from '@idearium/date';

timezoneFromState({ state: 'NSW' });
// returns 'Australia/Sydney'

timezoneFromState({ state: 'nsw' });
// returns 'Australia/Sydney' (case-insensitive)
```

### `formatDateWithTimeZone`

Accepts a single-object parameter with the following properties:

- `date` - the `Date` to format.
- `locales` - the BCP 47 locale tag to use (default: `en-AU`).
- `options` - the `Intl.DateTimeFormat` options to use (default: `{ dateStyle: 'full', timeStyle: 'short' }`). When supplied, this object replaces the default.
- `timeZone` - the IANA timezone to format the date in (for example, `Australia/Sydney`).

The `timeZone` returned by `timezoneFromState` is designed to be passed straight into `formatDateWithTimeZone`:

```js
import { formatDateWithTimeZone, timezoneFromState } from '@idearium/date';

const timeZone = timezoneFromState({ state: 'NSW' });
// 'Australia/Sydney'

formatDateWithTimeZone({
    date: new Date('2024-01-15T00:00:00Z'),
    timeZone,
});
// 'Monday, 15 January 2024 at 11:00 am'
```

A custom locale and options can be supplied to override the defaults:

```js
formatDateWithTimeZone({
    date: new Date('2024-01-15T00:00:00Z'),
    locales: 'en-US',
    options: { dateStyle: 'long' },
    timeZone: 'Australia/Sydney',
});
// 'January 15, 2024'
```
