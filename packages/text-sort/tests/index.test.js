'use strict';

const textSort = require('../');

it('has defaults', () => {
    expect(textSort()).toMatchObject([]);

    expect(
        textSort({
            array: [3, 2, 1],
        })
    ).toMatchObject([1, 2, 3]);
});

it('sorts alphabetically', () => {
    expect(
        textSort({
            array: [{ a: 3 }, { a: 2 }, { a: 1 }],
            sortValue: ({ a }) => a,
        })
    ).toMatchObject([{ a: 1 }, { a: 2 }, { a: 3 }]);
});

it('sorts in reverse alphabetical order', () => {
    expect(
        textSort({
            array: [{ a: 1 }, { a: 2 }, { a: 3 }],
            asc: false,
            sortValue: ({ a }) => a,
        })
    ).toMatchObject([{ a: 3 }, { a: 2 }, { a: 1 }]);
});
