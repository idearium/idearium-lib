'use strict';

const conf = require('./conf');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { expect } = require('chai');
const { mq } = require('../');

const dir = path.resolve(__dirname, '..', 'lib-mq-manager');
const exchange = 'update';
const file = 'test-file';
const queue = 'lib.app.test.update';
const routingKey = 'lib.app.test.update';

/* eslint-disable max-nested-callbacks */
describe('common/mq/util', function () {

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

        this.timeout(10000);

        const mqManager = new mq.Manager(dir);

        // eslint-disable-next-line global-require
        const { consume } = require('../common/mq/util');

        message.consume = consume((data) => {

            expect(data).to.eql([{ 'will-publish-a-message': true }]);

            done();

            return Promise.resolve();

        }, {
            exchange,
            queue,
            routingKey,
        });

        console.log(message);

        mqManager.addListener('load', () => mqManager.registerConsumers());

    });

    it('will publish a message', function () {

        const mqManager = new mq.Manager(dir);

        // eslint-disable-next-line global-require
        const { publish } = require('../common/mq/util');

        message.publish = (publish({
            exchange,
            routingKey,
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
