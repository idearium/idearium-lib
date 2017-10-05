'use strict';

const conf = require('./conf');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { expect } = require('chai');
const { mq } = require('../');

const dir = path.resolve(__dirname, '..', 'messages');
const file = 'test-file';

/* eslint-disable max-nested-callbacks */
describe('common/mq/consume', function () {

    let message;

    before(function (done) {

        // eslint-disable-next-line global-require
        require('../common/config').set('mqUrl', conf.rabbitUrl);

        rimraf(dir, () => fs.mkdir(dir, (err) => {

            if (err) {
                return done(err);
            }

            fs.writeFile(path.join(dir, `${file}.js`), 'module.exports = { consume: () => Promise.resolve(), publish: () => Promise.resolve() };', (writeErr) => {

                if (writeErr) {
                    return done(writeErr);
                }

                // eslint-disable-next-line global-require
                message = require(path.join(dir, `${file}.js`));

                return done();

            });

        }));

    });

    it('will execute consumers', function (done) {

        const mqManager = new mq.Manager(dir);

        /* eslint-disable global-require */
        const { consume } = require('../common/mq/consume');
        const { publish } = require('../common/mq/publish');
        /* eslint-enable global-require */

        message.consume = consume((data) => {

            expect(data).to.eql([{ 'will-execute-consumers': true }]);

            done();

            return Promise.resolve();

        }, {
            exchange: 'update',
            queue: 'lib.app.test.update.wec',
            routingKey: 'lib.app.test.update.wec',
        });

        message.publish = (publish({
            exchange: 'update',
            routingKey: 'lib.app.test.update.wec',
        }));

        // Catch and proxy any errors to `done`.
        try {

            // This will be cached.
            // eslint-disable-next-line global-require
            require('../common/mq/messages');

            // Wait until everything is loaded.
            mqManager.addListener('load', () => {

                // Run this manually, as it will have already run once.
                return mqManager.registerConsumers()
                    .then(() => mqManager.publish(file, { 'will-execute-consumers': true }))
                    .catch(done);

            });

        } catch (e) {
            return done(e);
        }

    });

    after(function (done) {
        return rimraf(dir, done);
    });

});
/* eslint-enable max-nested-callbacks */
