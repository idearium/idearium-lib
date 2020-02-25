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
    expect(l).toHaveProperty('getKeys');
    expect(l).toHaveProperty('getList');
    expect(l).toHaveProperty('getListValue');
    expect(l).toHaveProperty('getSelectList');
    expect(l).toHaveProperty('getSelectListWithKeys');
    expect(typeof l.getKeys).toBe('function');
    expect(typeof l.getList).toBe('function');
    expect(typeof l.getListValue).toBe('function');
    expect(typeof l.getSelectList).toBe('function');
    expect(typeof l.getSelectListWithKeys).toBe('function');
});

describe('lists.getKeys', () => {
    test('will return an empty array if provided nothing', () => {
        expect(lists.getKeys()).toEqual([]);
    });

    test('can return keys from different lists within a group', () => {
        expect(lists.getKeys({ group: 'documents', list: 'status' })).toEqual([
            'closed',
            'converted',
            'open'
        ]);
        expect(lists.getKeys({ group: 'documents', list: 'actions' })).toEqual([
            'status/close',
            'status/convert',
            'status/open'
        ]);
    });

    test('can return keys from different group lists', () => {
        expect(lists.getKeys({ group: 'user', list: 'groups' })).toEqual([
            'admin',
            'editor',
            'reviewer'
        ]);
        expect(lists.getKeys({ group: 'common', list: 'states' })).toEqual([
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
        expect(lists.getKeys({ group: 'common', list: 'days' })).toEqual([
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

describe('lists.getList', () => {
    test('will return an empty array if provided nothing', () => {
        expect(lists.getList()).toEqual([]);
    });
    test('can return values from different lists within a group', () => {
        expect(lists.getList({ group: 'documents', list: 'status' })).toEqual([
            'Closed',
            'Converted',
            'Open'
        ]);
        expect(lists.getList({ group: 'documents', list: 'actions' })).toEqual([
            'close',
            'convert',
            'open'
        ]);
    });
    test('can return values from different group lists', () => {
        expect(lists.getList({ group: 'user', list: 'groups' })).toEqual([
            'Admin',
            'Editor',
            'Reviewer'
        ]);
        expect(lists.getList({ group: 'common', list: 'states' })).toEqual([
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
        expect(lists.getList({ group: 'documents', list: 'actions' })).toEqual([
            'close',
            'convert',
            'open'
        ]);
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
            { label: 'Closed', value: 'Closed' },
            { label: 'Converted', value: 'Converted' },
            { label: 'Open', value: 'Open' }
        ]);
        expect(
            lists.getSelectList({ group: 'documents', list: 'actions' })
        ).toEqual([
            { label: 'close', value: 'close' },
            { label: 'convert', value: 'convert' },
            { label: 'open', value: 'open' }
        ]);
    });
    test('can return values from different group lists', () => {
        expect(lists.getSelectList({ group: 'user', list: 'groups' })).toEqual([
            { label: 'Admin', value: 'Admin' },
            { label: 'Editor', value: 'Editor' },
            { label: 'Reviewer', value: 'Reviewer' }
        ]);
        expect(
            lists.getSelectList({ group: 'common', list: 'states' })
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
            lists.getSelectList({ group: 'documents', list: 'actions' })
        ).toEqual([
            { label: 'close', value: 'close' },
            { label: 'convert', value: 'convert' },
            { label: 'open', value: 'open' }
        ]);
    });
});

describe('lists.getSelectListWithKeys', () => {
    test('will return an empty array if provided nothing', () => {
        expect(lists.getSelectListWithKeys()).toEqual([]);
    });
    test('can return label/value pairs from different lists within a group', () => {
        expect(
            lists.getSelectListWithKeys({ group: 'documents', list: 'status' })
        ).toEqual([
            { label: 'Closed', value: 'closed' },
            { label: 'Converted', value: 'converted' },
            { label: 'Open', value: 'open' }
        ]);
        expect(
            lists.getSelectListWithKeys({ group: 'documents', list: 'actions' })
        ).toEqual([
            { label: 'close', value: 'status/close' },
            { label: 'convert', value: 'status/convert' },
            { label: 'open', value: 'status/open' }
        ]);
    });
    test('can return values from different group lists', () => {
        expect(
            lists.getSelectListWithKeys({ group: 'user', list: 'groups' })
        ).toEqual([
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Reviewer', value: 'reviewer' }
        ]);
        expect(
            lists.getSelectListWithKeys({ group: 'common', list: 'states' })
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
            lists.getSelectListWithKeys({ group: 'documents', list: 'actions' })
        ).toEqual([
            { label: 'close', value: 'status/close' },
            { label: 'convert', value: 'status/convert' },
            { label: 'open', value: 'status/open' }
        ]);
    });
});
