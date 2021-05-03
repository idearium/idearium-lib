'use strict';

module.exports = {
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
    },
    documents: {
        actions: {
            'status/close': 'close',
            'status/convert': 'convert',
            'status/open': 'open'
        },
        status: {
            closed: 'Closed',
            converted: 'Converted',
            open: 'Open'
        }
    },
    user: {
        groups: {
            admin: 'Admin',
            editor: 'Editor',
            reviewer: 'Reviewer'
        }
    }
};
