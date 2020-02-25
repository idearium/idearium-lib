# @idearium/lists

This module makes it easy to work with lists.

To use the module, follow these steps.

-   Create a `lists.js` file similar to this:

```JavaScript
module.exports = {
    group: {
        list: {
            value: 'label'
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
