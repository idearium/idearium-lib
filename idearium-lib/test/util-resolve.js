'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { ack } = require('../lib/util');

chai.use(chaiAsPromised);

describe('util-resolve', function () {

    it('acknowledges a message and resolves a promise', function () {

        const msg = 'msg';
        const channel = { ack: message => msg === message };

        return ack(channel, msg).should.be.fulfilled;

    });

});
