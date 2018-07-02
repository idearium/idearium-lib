'use strict';

jest.mock('/app/config/config.js', () => ({
    logLevel: 'debug',
    logLocation: 'local',
    logToStdout: true,
    mqUrl: require('./conf').rabbitUrl,
}));

jest.mock('../messages/index.js', () => ({ consume: () => Promise.resolve(), publish: () => Promise.resolve() }));

describe('common/mq/publisher', function () {

    // This is run after common-mq-client and will have therefore cached the config from the previous test.
    // Set the mqUrl value as common/mq/client uses it.
    // eslint-disable-next-line global-require
    const message = require('../messages');

    test('will return a promise', (done) => {

        // This runs after test/common-mq-client.
        // That means some things have been cached.
        // The following test has been setup to accomodate that.

        // Create the publish function.
        message.publish = function publishTest (data) {

            expect(data).toEqual({ name: 'message-test' });

            return Promise.resolve();

        };

        // eslint-disable-next-line global-require
        const publish = require('../common/mq/publisher');

        // Publish the message.
        const result = publish('test', { name: 'message-test' });

        expect(result instanceof Promise).toBe(true);

        result
            .then(() => done())
            .catch(done);

    });

});
