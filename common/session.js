'use strict';

const config = require('./config');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const Redis = require('./redis');

module.exports = session({
    resave: false,
    saveUninitialized: false,
    secret: config.get('sessionSecret'),
    store: new RedisStore({ client: new Redis() }),
});
