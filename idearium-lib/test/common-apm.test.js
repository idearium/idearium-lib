'use strict';

const apm = require('../common/apm');

test('is a function', () => {

    expect(typeof apm).toBe('function');

});

test('has a default exception handler', () => {

    process.exit = () => 'exit';

    expect(apm.exceptionHandler()).toBe('exit');

});

test('can override the exception handler', () => {

    apm({ exceptionHandler: () => 'test' });

    expect(apm.exceptionHandler()).toBe('test');

});
