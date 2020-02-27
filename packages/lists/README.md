# @idearium/lists

This module makes it easy to work with lists.

## Usage

To use the module, follow these steps.

-   Create a `lists.js` file similar to this:

```JavaScript
module.exports = {
    group: {
        list: {
            key: 'value'
        }
    },
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
}
```

-   Load the lists, pass it to this module and use the functions to retrieve data as required:

```JavaScript
const lists = require('@idearium/lists')({ lists: require('./lists') });
const days = lists.getKeys({ group: 'common', list: 'days' });
// days == ['friday','monday','saturday','sunday','thursday','tuesday','wednesday']
```

## Functions

Once setup, there are a number of functions you can use to retrieve data from your lists.

### getKeys

`getKeys` will return an array of the keys from a list.

```JavaScript
const days = lists.getKeys({ group: 'common', list: 'days' });
// days == ['friday','monday','saturday','sunday','thursday','tuesday','wednesday']
```

### getList

`getList` will return a list without any modification.

```JavaScript
const days = lists.getList({ group: 'common', list: 'days' });
// days == {friday: 'Friday', monday: 'Monday', saturday: 'Saturday', sunday: 'Sunday', thursday: 'Thursday',tuesday: 'Tuesday', wednesday: 'Wednesday'}
```

### getListKey

`getListKey` will return a specific label's value from a list.

```JavaScript
const day = lists.getListKey({ group: 'common', list: 'days', value: 'Thursday' });
// days == 'thursday'
```

### getListValue

`getListValue` will return a specific label's value from a list.

```JavaScript
const day = lists.getListValue({ group: 'common', key: 'thursday', list: 'days' });
// days == 'Thursday'
```

### getSelectList

`getSelectList` will return an array of objects with label and value properties.

```JavaScript
const days = lists.getSelectList({ group: 'common', list: 'days' });
// days == [{label: 'Friday', value: 'friday'}, {label: 'Monday', value: 'monday'}, {label:'Saturday', value:'saturday'}, {label: 'Sunday', value: 'sunday'}, {label: 'Thursday', value: 'thursday'}, {label: 'Tuesday', value: 'tuesday'}, {label: 'Wednesday', value: 'wednesday'}]
```

### getSelectListWithKeys

`getSelectListWithKeys` will return an array of objects with label and value properties, using the key.

```JavaScript
const days = lists.getSelectListWithKeys({ group: 'common', list: 'days' });
// days == [{label: 'friday', value: 'friday'}, {label: 'monday', value: 'monday'}, {label:'saturday', value:'saturday'}, {label: 'sunday', value: 'sunday'}, {label: 'thursday', value: 'thursday'}, {label: 'tuesday', value: 'tuesday'}, {label: 'wednesday', value: 'wednesday'}]
```

### getSelectListWithValues

`getSelectListWithValues` will return an array of objects with label and value properties, using the value.

```JavaScript
const days = lists.getSelectListWithValues({ group: 'common', list: 'days' });
// days == [{label: 'Friday', value: 'Friday'}, {label: 'Monday', value: 'Monday'}, {label:'Saturday', value:'Saturday'}, {label: 'Sunday', value: 'Sunday'}, {label: 'Thursday', value: 'Thursday'}, {label: 'Tuesday', value: 'Tuesday'}, {label: 'Wednesday', value: 'Wednesday'}]
```

### getValues

`getValues` will return an array of the values from a list.

```JavaScript
const days = lists.getValues({ group: 'common', list: 'days' });
// days == ['Friday','Monday','Saturday','Sunday','Thursday','Tuesday','Wednesday']
```
