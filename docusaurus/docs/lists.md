---
id: lists
title: @idearium/lists
---

A library to make it easy to work with application lists. Application lists are used to record any fixed parts of your application, and use the following terminology:

```JavaScript
export default {
    group: {
        list: {
            key: 'value'
        }
    },
};
```

-   `group` is used to define a group of lists which share a context (usually described by the group name).
-   `list` is the list itself.

## Installation

```shell
$ yarn add -E @idearium/lists
```

### Beta installation

If you need to install a beta version, you can:

```shell
$ yarn add -E @idearium/lists@beta
```

## Usage

To use `@idearium/lists`, follow these steps:

-   [Create a library file.](#create-a-library-file)
-   [Use the library file within your app.](#use-the-library-file)

### Create a library file

Start by creating a library file containing your lists. Import `@idearium/lists` and use it to wrap export so that your list is augmented with help functions to access your lists in various formats.

```JavaScript
// lib/lists.js

import lists from '@idearium/lists';

const groupedLists = {
    common: {
        days: {
            friday: 'Friday',
            monday: 'Monday',
            saturday: 'Saturday',
            sunday: 'Sunday',
            thursday: 'Thursday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday'
        },
        states: {
            ACT: 'Australian Capital Territory',
            NSW: 'New South Wales',
            NT: 'Northern Territory',
            QLD: 'Queensland',
            SA: 'South Australia',
            TAS: 'Tasmania',
            VIC: 'Victoria',
            WA: 'Western Australia'
        }
    }
};

export default lists({ lists: groupedLists });
```

### Use the library file

You can now use the lists anywhere in your app.

```JavaScript
import lists from './lists';

const days = lists.getKeys({ group: 'common', list: 'days' });
// days == ['friday','monday','saturday','sunday','thursday','tuesday','wednesday']

const states = lists.getKeys({ group: 'common', list: 'states' });
// states == ['ACT','NSW','NT','QLD','SA','TAS','VIC', 'WA']
```

## Functions

Once setup, there are a number of functions you can use to retrieve data from your lists.

### getKeys

`getKeys` will return an array of the keys from a list.

```JavaScript
const days = getKeys({ group: 'common', list: 'days' });
// days == ['friday','monday','saturday','sunday','thursday','tuesday','wednesday']
```

### getList

`getList` will return a list without any modification.

```JavaScript
const days = getList({ group: 'common', list: 'days' });
// days == {friday: 'Friday', monday: 'Monday', saturday: 'Saturday', sunday: 'Sunday', thursday: 'Thursday',tuesday: 'Tuesday', wednesday: 'Wednesday'}
```

### getListKey

`getListKey` will return a specific key from a list.

```JavaScript
const day = getListKey({ group: 'common', list: 'days', value: 'Thursday' });
// days == 'thursday'
```

### getListValue

`getListValue` will return a specific value from a list.

```JavaScript
const day = getListValue({ group: 'common', key: 'thursday', list: 'days' });
// days == 'Thursday'
```

### getSelectList

`getSelectList` will return an array of objects with label (`value`) and value (`key`) properties.

```JavaScript
const days = getSelectList({ group: 'common', list: 'days' });
// days == [{label: 'Friday', value: 'friday'}, {label: 'Monday', value: 'monday'}, {label:'Saturday', value:'saturday'}, {label: 'Sunday', value: 'sunday'}, {label: 'Thursday', value: 'thursday'}, {label: 'Tuesday', value: 'tuesday'}, {label: 'Wednesday', value: 'wednesday'}]
```

### getSelectListWithKeys

`getSelectListWithKeys` will return an array of objects with label and value properties, using only the `key`.

```JavaScript
const days = getSelectListWithKeys({ group: 'common', list: 'days' });
// days == [{label: 'friday', value: 'friday'}, {label: 'monday', value: 'monday'}, {label:'saturday', value:'saturday'}, {label: 'sunday', value: 'sunday'}, {label: 'thursday', value: 'thursday'}, {label: 'tuesday', value: 'tuesday'}, {label: 'wednesday', value: 'wednesday'}]
```

### getSelectListWithValues

`getSelectListWithValues` will return an array of objects with label and value properties, using only the `value`.

```JavaScript
const days = getSelectListWithValues({ group: 'common', list: 'days' });
// days == [{label: 'Friday', value: 'Friday'}, {label: 'Monday', value: 'Monday'}, {label:'Saturday', value:'Saturday'}, {label: 'Sunday', value: 'Sunday'}, {label: 'Thursday', value: 'Thursday'}, {label: 'Tuesday', value: 'Tuesday'}, {label: 'Wednesday', value: 'Wednesday'}]
```

### getValues

`getValues` will return an array of the values from a list.

```JavaScript
const days = getValues({ group: 'common', list: 'days' });
// days == ['Friday','Monday','Saturday','Sunday','Thursday','Tuesday','Wednesday']
```
