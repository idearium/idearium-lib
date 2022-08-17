'use strict';

const log = require('@idearium/log')();
const libCookie = require('cookie');

const create = ({ cookie, expires, name, ...cookieOpts } = {}) => {
    const now = new Date();

    if (!expires) {
        now.setTime(now.getTime() + 60 * 60 * 1000);
    }

    return libCookie.serialize(name, cookie, {
        expires: expires || now,
        httpOnly: true,
        maxAge: 3600,
        path: '/',
        ...cookieOpts,
    });
};

const find = ({ cookies, name, ...cookieOpts } = {}) => {
    const parsedCookies = libCookie.parse(cookies, { ...cookieOpts });
    const foundCookie = Object.keys(parsedCookies).some(
        (cookieLabel) => cookieLabel === name
    );

    if (!foundCookie) {
        log.trace({ cookies, name }, 'Cookie does not exist.');

        return null;
    }

    const cookie = parsedCookies[name];

    log.trace({ cookie, cookies, name }, 'Found cookie.');

    return cookie;
};

module.exports = {
    create,
    find,
};
