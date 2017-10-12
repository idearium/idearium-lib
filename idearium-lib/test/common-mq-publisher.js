'use strict';

const path = require('path');
const fs = require('fs');
const { expect } = require('chai');
const dir = path.resolve(__dirname, '..', 'messages');
const conf = require('./conf');

describe('common/mq/publisher', function () {

    let message;

    // This is run after common-mq-client and will have therefore cached the config from the previous test.
    // Set the mqUrl value as common/mq/client uses it.
    before(function (done) {

        // eslint-disable-next-line global-require
        const config = require('../common/config');

        config.set('mqUrl', conf.rabbitUrl);
        config.set('logLocation', 'local');
        config.set('logLevel', 'debug');
        config.set('logToStdout', true);

        // Add some fake messages to load.
        fs.mkdir(dir, function (err) {

            // If it already exists, that's fine, let's just create the file itself.
            /* eslint-disable padded-blocks */
            if (err) {
                return done(err);
            }
            /* eslint-enable padded-blocks */

            fs.writeFile(path.join(dir, 'test.js'), 'module.exports = { "consume": () => Promise.resolve(), "publish": () => Promise.resolve() };', function (writeErr) {

                /* eslint-disable padded-blocks */
                if (writeErr) {
                    return done(writeErr);
                }
                /* eslint-enable padded-blocks */

                // eslint-disable-next-line global-require
                message = require('../messages/test.js');

                return done();

            });

        });

    });

    it('will return a promise', function (done) {

        // This runs after test/common-mq-client.
        // That means some things have been cached.
        // The following test has been setup to accomodate that.

        // Create the publish function.
        message.publish = function publishTest (data) {

            expect(data).to.eql({ name: 'message-test' });

            return Promise.resolve();

        };

        // eslint-disable-next-line global-require
        const publish = require('../common/mq/publisher');

        // Publish the message.
        const result = publish('test', { name: 'message-test' });

        expect(result).to.be.instanceof(Promise);

        result
            .then(() => done())
            .catch(done);

    });

    after(function (done) {

        fs.unlink(path.join(dir, 'test.js'), function () {

            fs.rmdir(dir, done);

        });

    });

});
