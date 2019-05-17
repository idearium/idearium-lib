'use strict';

const mongoose = require('mongoose');
const { find, findOne } = require('../lib/query');

describe('query', () => {

    const userModel = mongoose.model('userModel', new mongoose.Schema({
        email: String,
        username: String,
    }));

    test('will return a query object', () => {

        const queryObject = find(userModel, {
            filter: { _id: '5938a0aefb6e41e0e8368d00' },
            lean: false,
            limit: 20,
            projection: 'email username',
        });

        const { _conditions, _fields, _mongooseOptions, options } = queryObject;

        expect(_conditions._id.toString()).toBe('5938a0aefb6e41e0e8368d00');
        expect(_mongooseOptions.lean).toBe(false);
        expect(Object.keys(_fields).sort()).toEqual(['email', 'username']);
        expect(options.limit).toBe(20);

    });

    test('will return a query object', () => {

        const queryObject = find(userModel, {
            filter: { _id: '5938a0aefb6e41e0e8368d00' },
            lean: false,
            projection: 'email username',
        });

        const { _conditions, _fields, _mongooseOptions, options } = queryObject;

        expect(_conditions._id.toString()).toBe('5938a0aefb6e41e0e8368d00');
        expect(_mongooseOptions.lean).toBe(false);
        expect(Object.keys(_fields).sort()).toEqual(['email', 'username']);
        expect(options.limit).toBe(10);

    });

    test('will return a query object', () => {

        const queryObject = find(userModel, {
            filter: { _id: '5938a0aefb6e41e0e8368d00' },
            projection: 'email username',
        });

        const { _conditions, _fields, _mongooseOptions, options } = queryObject;

        expect(_conditions._id.toString()).toBe('5938a0aefb6e41e0e8368d00');
        expect(_mongooseOptions.lean).toBe(true);
        expect(Object.keys(_fields).sort()).toEqual(['email', 'username']);
        expect(options.limit).toBe(10);

    });

    test('will return a query object', () => {

        const queryObject = find(userModel, {
            filter: { _id: '5938a0aefb6e41e0e8368d00' },
        });

        const { _conditions, _fields, _mongooseOptions, options } = queryObject;

        expect(_conditions._id.toString()).toBe('5938a0aefb6e41e0e8368d00');
        expect(_mongooseOptions.lean).toBe(true);
        expect(Object.keys(_fields).sort()).toEqual(['_id']);
        expect(options.limit).toBe(10);

    });

    test('will return a query object', () => {

        const queryObject = findOne(userModel, {
            filter: { _id: '5938a0aefb6e41e0e8368d00' },
            lean: false,
            projection: 'email username',
        });

        const { _conditions, _fields, _mongooseOptions } = queryObject;

        expect(_conditions._id.toString()).toBe('5938a0aefb6e41e0e8368d00');
        expect(_mongooseOptions.lean).toBe(false);
        expect(Object.keys(_fields).sort()).toEqual(['email', 'username']);

    });

    test('will return a query object', () => {

        const queryObject = findOne(userModel, {
            filter: { _id: '5938a0aefb6e41e0e8368d00' },
            projection: 'email username',
        });

        const { _conditions, _fields, _mongooseOptions } = queryObject;

        expect(_conditions._id.toString()).toBe('5938a0aefb6e41e0e8368d00');
        expect(_mongooseOptions.lean).toBe(true);
        expect(Object.keys(_fields).sort()).toEqual(['email', 'username']);

    });

    test('will return a query object', () => {

        const queryObject = findOne(userModel, {
            filter: { _id: '5938a0aefb6e41e0e8368d00' },
        });

        const { _conditions, _fields, _mongooseOptions } = queryObject;

        expect(_conditions._id.toString()).toBe('5938a0aefb6e41e0e8368d00');
        expect(_mongooseOptions.lean).toBe(true);
        expect(Object.keys(_fields).sort()).toEqual(['_id']);

    });

});
