'use strict';

jest.mock('/app/config/config.js', () => ({
    logLevel: 'debug',
    logLocation: 'local',
    logToStdout: true,
}));

// eslint-disable-next-line no-process-env
process.env.ELASTIC_APM_ACTIVE = 'false';

let apm;

// eslint-disable-next-line global-require
beforeEach(() => (apm = require('../common/apm')));

test('is a function', () => {

    expect(typeof apm.start).toBe('function');

});

test('has a default exception handler', () => {

    process.exit = jest.fn();

    const testApm = apm.start();

    testApm.exceptionHandler(new Error('test'));

    // Test process.exit is called
    expect(process.exit.mock.calls.length).toBe(1);

});

test('can override the exception handler', () => {

    process.exit = jest.fn();

    const mockExceptionHandler = jest.fn();

    mockExceptionHandler.mockReturnValue('test');

    const testApm = apm.start({ exceptionHandler: mockExceptionHandler });

    // Test the new exception handler is called and the default process.exit is not called.
    // The test will also fail if the default is called because it requires err.message.
    expect(testApm.exceptionHandler()).toBe('test');
    expect(process.exit.mock.calls.length).toBe(0);

});
