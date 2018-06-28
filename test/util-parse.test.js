'use strict';

const fs = require('fs');
const util = require('../lib/util');
const path = require('path');

describe('util-parse', () => {

    describe('parseConfigAsBoolean()', () => {

        test('should error if default value is not provided', () => {

            expect(() => util.parseConfigAsBoolean()).toThrow();

        });

        test('should return default value if provided value is undefined', () => {

            const result1 = util.parseConfigAsBoolean(undefined, true);
            const result2 = util.parseConfigAsBoolean(undefined, false);

            expect(result1).toBe(true);
            expect(result2).toBe(false);

        });

        test('should return true if provided value is a String of "true"', () => {

            const result1 = util.parseConfigAsBoolean('true', true);

            expect(result1).toBe(true);

        });


        test('should return true if provided value is a String of "false"', () => {

            const result1 = util.parseConfigAsBoolean('false', true);

            expect(result1).toBe(false);

        });

    });

    describe('parseCsv', () => {

        test('should parse a csv file', async () => {

            expect.assertions(1);

            const stream = fs.createReadStream(path.resolve(__dirname, 'data', 'test.csv'));
            const data = await util.parseCsv(stream);

            expect(data).toEqual([
                ['col1', 'col2', 'col3', 'col4', 'col5'],
                ['Test1.1', 'Test1.2', 'Test1.3', 'Test1.4', ''],
                ['Test2.1', 'Test2.2', 'Test2.3', 'Test2.4', ''],
                ['Test3.1', 'Test3.2', 'Test3.3', 'Test3.4', '😊'],
                ['Test4.1', 'Test4.2', 'Test4.3', 'Test4.4', 'Test4.5'],
                ['Test5.1', 'Test5.2', 'Test5.3', 'Test5.4', 'Test5.5'],
            ]);

        });

        test('should parse csv buffered data', async () => {

            expect.assertions(1);

            const csv = 'col1,col2,col3,col4,col5\nTest1.1,Test1.2,Test1.3,Test1.4,\nTest2.1,Test2.2,Test2.3,Test2.4,""\nTest3.1,Test3.2,Test3.3,Test3.4,😊\nTest4.1,Test4.2,Test4.3,Test4.4,Test4.5\nTest5.1,Test5.2,Test5.3,Test5.4,Test5.5';
            const buffer = Buffer.from(csv);
            const data = await util.parseCsv(buffer);

            expect(data).toEqual([
                ['col1', 'col2', 'col3', 'col4', 'col5'],
                ['Test1.1', 'Test1.2', 'Test1.3', 'Test1.4', ''],
                ['Test2.1', 'Test2.2', 'Test2.3', 'Test2.4', ''],
                ['Test3.1', 'Test3.2', 'Test3.3', 'Test3.4', '😊'],
                ['Test4.1', 'Test4.2', 'Test4.3', 'Test4.4', 'Test4.5'],
                ['Test5.1', 'Test5.2', 'Test5.3', 'Test5.4', 'Test5.5'],
            ]);

        });

        test('should transform using the provided function', async () => {

            expect.assertions(1);

            const stream = fs.createReadStream(path.resolve(__dirname, 'data', 'test.csv'));
            const transform = (row, callback) => callback(null, row.map(cell => cell.toUpperCase()));
            const data = await util.parseCsv(stream, { transform });

            expect(data).toEqual([
                ['COL1', 'COL2', 'COL3', 'COL4', 'COL5'],
                ['TEST1.1', 'TEST1.2', 'TEST1.3', 'TEST1.4', ''],
                ['TEST2.1', 'TEST2.2', 'TEST2.3', 'TEST2.4', ''],
                ['TEST3.1', 'TEST3.2', 'TEST3.3', 'TEST3.4', '😊'],
                ['TEST4.1', 'TEST4.2', 'TEST4.3', 'TEST4.4', 'TEST4.5'],
                ['TEST5.1', 'TEST5.2', 'TEST5.3', 'TEST5.4', 'TEST5.5'],
            ]);

        });

        test('should fail if there is an error with the csv', async () => {

            expect.assertions(1);

            const csv = 'col1,col2,col3,col4,col5\nTest1.1,Test1.2,Test1.3,Test1.4,\nTest2.1,Test2.2,Test2.3,Test2.4,""\nTest3.1,Test3.2,Test3.3,Test3.4,😊\nTest4.1,Test4.2,Test4.3,Test4.4,Test4.5\nTest5.1,Test5.2,Test5.3,Test5.4';
            const buffer = Buffer.from(csv);

            try {

                await util.parseCsv(buffer)

            } catch (err) {

                expect(err.message).toBe('Number of columns is inconsistent on line 6');

            }

        });

    });

});
