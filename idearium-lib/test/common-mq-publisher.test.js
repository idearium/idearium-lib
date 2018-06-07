'use strict';

const path = require('path');
const fs = require('fs');
const dir = path.resolve(__dirname, '..', 'messages');

jest.mock('/app/config/config.js', () => ({
    logLevel: 'debug',
    logLocation: 'local',
    logToStdout: true,
    mqUrl: require('./conf').rabbitUrl,
}));

describe('common/mq/publisher', function () {

    let message;

    // This is run after common-mq-client and will have therefore cached the config from the previous test.
    // Set the mqUrl value as common/mq/client uses it.
    beforeAll((done) => {

        // Add some fake messages to load.
        fs.mkdir(dir, function (err) {

            // If it already exists, that's fine, let's just create the file itself.
            /* eslint-disable padded-blocks */
            if (err) {
                return done(err);
            }
            /* eslint-enable padded-blocks */

            fs.writeFile(path.join(dir, 'mq-publisher-test.js'), 'module.exports = { "consume": () => Promise.resolve(), "publish": () => Promise.resolve() };', function (writeErr) {

                /* eslint-disable padded-blocks */
                if (writeErr) {
                    return done(writeErr);
                }
                /* eslint-enable padded-blocks */

                // eslint-disable-next-line global-require
                message = require('../messages/mq-publisher-test.js');

                return done();

            });

        });

    });

    it('will return a promise', (done) => {

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

    afterAll((done) => {

        fs.unlink(path.join(dir, 'mq-publisher-test.js'), function () {

            fs.rmdir(dir, done);

        });

    });

});
