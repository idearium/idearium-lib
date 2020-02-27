'use strict';

const fn = require('../');
// eslint-disable-next-line global-require
const lists = fn({ lists: require('./lists') });

test('lists is a function', () => {
    expect(typeof fn).toBe('function');
});

test('lists will return an object with properties', () => {
    const l = fn();

    expect(typeof l).toBe('object');
    expect(l).toHaveProperty('getLabels');
    expect(l).toHaveProperty('getList');
    expect(l).toHaveProperty('getListValue');
    expect(l).toHaveProperty('getSelectList');
    expect(l).toHaveProperty('getSelectListWithLabels');
    expect(l).toHaveProperty('getSelectListWithValues');
    expect(l).toHaveProperty('getValues');
    expect(typeof l.getLabels).toBe('function');
    expect(typeof l.getList).toBe('function');
    expect(typeof l.getListValue).toBe('function');
    expect(typeof l.getSelectList).toBe('function');
    expect(typeof l.getSelectListWithLabels).toBe('function');
    expect(typeof l.getSelectListWithValues).toBe('function');
    expect(typeof l.getValues).toBe('function');
});

describe('lists.getLabels', () => {
    test('will return an empty array if provided nothing', () => {
        expect(lists.getLabels()).toEqual([]);
    });
    test('can return values from different lists within a group', () => {
        expect(lists.getLabels({ group: 'documents', list: 'status' })).toEqual(
            ['Closed', 'Converted', 'Open']
        );
        expect(
            lists.getLabels({ group: 'documents', list: 'actions' })
        ).toEqual(['close', 'convert', 'open']);
    });
    test('can return values from different group lists', () => {
        expect(lists.getLabels({ group: 'user', list: 'groups' })).toEqual([
            'Admin',
            'Editor',
            'Reviewer'
        ]);
        expect(lists.getLabels({ group: 'common', list: 'states' })).toEqual([
            'Australian Capital Territory',
            'New South Wales',
            'Northern Territory',
            'Queensland',
            'South Australia',
            'Tasmania',
            'Victoria',
            'Western Australia'
        ]);
    });
    test('will return the values for a list', () => {
        expect(
            lists.getLabels({ group: 'documents', list: 'actions' })
        ).toEqual(['close', 'convert', 'open']);
    });
});

describe('lists.getList', () => {
    test('will return an empty array if provided nothing', () => {
        expect(lists.getList()).toEqual([]);
    });
    test('can return values from different lists within a group', () => {
        expect(lists.getList({ group: 'documents', list: 'status' })).toEqual({
            closed: 'Closed',
            converted: 'Converted',
            open: 'Open'
        });
        expect(lists.getList({ group: 'documents', list: 'actions' })).toEqual({
            'status/close': 'close',
            'status/convert': 'convert',
            'status/open': 'open'
        });
    });
    test('can return values from different group lists', () => {
        expect(lists.getList({ group: 'user', list: 'groups' })).toEqual({
            admin: 'Admin',
            editor: 'Editor',
            reviewer: 'Reviewer'
        });
        expect(lists.getList({ group: 'common', list: 'states' })).toEqual({
            ACT: 'Australian Capital Territory',
            NSW: 'New South Wales',
            NT: 'Northern Territory',
            QLD: 'Queensland',
            SA: 'South Australia',
            TAS: 'Tasmania',
            VIC: 'Victoria',
            WA: 'Western Australia'
        });
    });
    test('will return the values for a list', () => {
        expect(lists.getList({ group: 'documents', list: 'actions' })).toEqual({
            'status/close': 'close',
            'status/convert': 'convert',
            'status/open': 'open'
        });
    });
});

describe('lists.getListValue', () => {
    test('will return null if provided nothing', () => {
        expect(lists.getListValue()).toEqual(null);
    });
    test('can return a value from different lists within a group', () => {
        expect(
            lists.getListValue({
                group: 'documents',
                list: 'status',
                value: 'closed'
            })
        ).toEqual('Closed');
        expect(
            lists.getListValue({
                group: 'documents',
                list: 'actions',
                value: 'status/close'
            })
        ).toEqual('close');
    });
    test('can return a value from different group lists', () => {
        expect(
            lists.getListValue({
                group: 'user',
                list: 'groups',
                value: 'admin'
            })
        ).toEqual('Admin');
        expect(
            lists.getListValue({ group: 'common', list: 'states', value: 'NT' })
        ).toEqual('Northern Territory');
    });
    test('will return a value from a list', () => {
        expect(
            lists.getListValue({
                group: 'documents',
                list: 'actions',
                value: 'status/close'
            })
        ).toEqual('close');
    });
});

describe('lists.getSelectList', () => {
    test('will return an empty array if provided nothing', () => {
        expect(lists.getSelectList()).toEqual([]);
    });
    test('can return label/value pairs from different lists within a group', () => {
        expect(
            lists.getSelectList({ group: 'documents', list: 'status' })
        ).toEqual([
            { label: 'Closed', value: 'closed' },
            { label: 'Converted', value: 'converted' },
            { label: 'Open', value: 'open' }
        ]);
        expect(
            lists.getSelectList({ group: 'documents', list: 'actions' })
        ).toEqual([
            { label: 'close', value: 'status/close' },
            { label: 'convert', value: 'status/convert' },
            { label: 'open', value: 'status/open' }
        ]);
    });
    test('can return values from different group lists', () => {
        expect(lists.getSelectList({ group: 'user', list: 'groups' })).toEqual([
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Reviewer', value: 'reviewer' }
        ]);
        expect(
            lists.getSelectList({ group: 'common', list: 'states' })
        ).toEqual([
            { label: 'Australian Capital Territory', value: 'ACT' },
            { label: 'New South Wales', value: 'NSW' },
            { label: 'Northern Territory', value: 'NT' },
            { label: 'Queensland', value: 'QLD' },
            { label: 'South Australia', value: 'SA' },
            { label: 'Tasmania', value: 'TAS' },
            { label: 'Victoria', value: 'VIC' },
            { label: 'Western Australia', value: 'WA' }
        ]);
    });
    test('will return the values for a list', () => {
        expect(
            lists.getSelectList({ group: 'documents', list: 'actions' })
        ).toEqual([
            { label: 'close', value: 'status/close' },
            { label: 'convert', value: 'status/convert' },
            { label: 'open', value: 'status/open' }
        ]);
    });
});

describe('lists.getSelectListWithLabels', () => {
    test('will return an empty array if provided nothing', () => {
        expect(lists.getSelectListWithLabels()).toEqual([]);
    });
    test('can return label/value pairs from different lists within a group', () => {
        expect(
            lists.getSelectListWithLabels({
                group: 'documents',
                list: 'status'
            })
        ).toEqual([
            { label: 'Closed', value: 'Closed' },
            { label: 'Converted', value: 'Converted' },
            { label: 'Open', value: 'Open' }
        ]);
        expect(
            lists.getSelectListWithLabels({
                group: 'documents',
                list: 'actions'
            })
        ).toEqual([
            { label: 'close', value: 'close' },
            { label: 'convert', value: 'convert' },
            { label: 'open', value: 'open' }
        ]);
    });
    test('can return values from different group lists', () => {
        expect(
            lists.getSelectListWithLabels({ group: 'user', list: 'groups' })
        ).toEqual([
            { label: 'Admin', value: 'Admin' },
            { label: 'Editor', value: 'Editor' },
            { label: 'Reviewer', value: 'Reviewer' }
        ]);
        expect(
            lists.getSelectListWithLabels({ group: 'common', list: 'states' })
        ).toEqual([
            {
                label: 'Australian Capital Territory',
                value: 'Australian Capital Territory'
            },
            { label: 'New South Wales', value: 'New South Wales' },
            { label: 'Northern Territory', value: 'Northern Territory' },
            { label: 'Queensland', value: 'Queensland' },
            { label: 'South Australia', value: 'South Australia' },
            { label: 'Tasmania', value: 'Tasmania' },
            { label: 'Victoria', value: 'Victoria' },
            { label: 'Western Australia', value: 'Western Australia' }
        ]);
    });
    test('will return the values for a list', () => {
        expect(
            lists.getSelectListWithLabels({
                group: 'documents',
                list: 'actions'
            })
        ).toEqual([
            { label: 'close', value: 'close' },
            { label: 'convert', value: 'convert' },
            { label: 'open', value: 'open' }
        ]);
    });
});

describe('lists.getSelectListWithValues', () => {
    test('will return an empty array if provided nothing', () => {
        expect(lists.getSelectListWithValues()).toEqual([]);
    });
    test('can return label/value pairs from different lists within a group', () => {
        expect(
            lists.getSelectListWithValues({
                group: 'documents',
                list: 'status'
            })
        ).toEqual([
            { label: 'closed', value: 'closed' },
            { label: 'converted', value: 'converted' },
            { label: 'open', value: 'open' }
        ]);
        expect(
            lists.getSelectListWithValues({
                group: 'documents',
                list: 'actions'
            })
        ).toEqual([
            { label: 'status/close', value: 'status/close' },
            { label: 'status/convert', value: 'status/convert' },
            { label: 'status/open', value: 'status/open' }
        ]);
    });
    test('can return values from different group lists', () => {
        expect(
            lists.getSelectListWithValues({ group: 'user', list: 'groups' })
        ).toEqual([
            { label: 'admin', value: 'admin' },
            { label: 'editor', value: 'editor' },
            { label: 'reviewer', value: 'reviewer' }
        ]);
        expect(
            lists.getSelectListWithValues({ group: 'common', list: 'states' })
        ).toEqual([
            {
                label: 'ACT',
                value: 'ACT'
            },
            { label: 'NSW', value: 'NSW' },
            { label: 'NT', value: 'NT' },
            { label: 'QLD', value: 'QLD' },
            { label: 'SA', value: 'SA' },
            { label: 'TAS', value: 'TAS' },
            { label: 'VIC', value: 'VIC' },
            { label: 'WA', value: 'WA' }
        ]);
    });
    test('will return the values for a list', () => {
        expect(
            lists.getSelectListWithValues({
                group: 'documents',
                list: 'actions'
            })
        ).toEqual([
            { label: 'status/close', value: 'status/close' },
            { label: 'status/convert', value: 'status/convert' },
            { label: 'status/open', value: 'status/open' }
        ]);
    });
});

describe('lists.getValues', () => {
    test('will return an empty array if provided nothing', () => {
        expect(lists.getValues()).toEqual([]);
    });

    test('can return keys from different lists within a group', () => {
        expect(lists.getValues({ group: 'documents', list: 'status' })).toEqual(
            ['closed', 'converted', 'open']
        );
        expect(
            lists.getValues({ group: 'documents', list: 'actions' })
        ).toEqual(['status/close', 'status/convert', 'status/open']);
    });

    test('can return keys from different group lists', () => {
        expect(lists.getValues({ group: 'user', list: 'groups' })).toEqual([
            'admin',
            'editor',
            'reviewer'
        ]);
        expect(lists.getValues({ group: 'common', list: 'states' })).toEqual([
            'ACT',
            'NSW',
            'NT',
            'QLD',
            'SA',
            'TAS',
            'VIC',
            'WA'
        ]);
    });

    test('will return the keys for a list', () => {
        expect(lists.getValues({ group: 'common', list: 'days' })).toEqual([
            'friday',
            'monday',
            'saturday',
            'sunday',
            'thursday',
            'tuesday',
            'wednesday'
        ]);
    });
});
