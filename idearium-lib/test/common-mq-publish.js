'use strict';

const conf = require('./conf');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { mq } = require('../');

const dir = path.resolve(__dirname, '..', 'lib-mq-manager');
const file = 'test-file';

/* eslint-disable max-nested-callbacks */
describe('common/mq/publish', function () {

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

    it('will publish a message', function () {

        const mqManager = new mq.Manager(dir);

        // eslint-disable-next-line global-require
        const { publish } = require('../common/mq/publish');

        message.publish = (publish({
            exchange: 'update',
            routingKey: 'lib.app.test.update.wpm',
        }));

        mqManager.addListener('load', () => {
            mqManager.publish(file, { 'will-publish-a-message': true });
        });

    });

    after(function (done) {
        return rimraf(dir, done);
    });

});
/* eslint-enable max-nested-callbacks */
