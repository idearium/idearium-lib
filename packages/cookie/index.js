'use strict';

const log = require('@idearium/log')();
const libCookie = require('cookie');

const create = async ({ cookie, expires, name, ...cookieOpts } = {}) => {
    const now = new Date();

    return libCookie.serialize(name, cookie, {
        expires: expires || now.setTime(now.getTime() + 60 * 60 * 1000),
        httpOnly: true,
        maxAge: 3600,
        path: '/',
        ...cookieOpts,
    });
};

const find = async ({ cookies, name, ...cookieOpts } = {}) => {
    const parsedCookies = libCookie.parse(cookies, { ...cookieOpts });
    const foundCookie = Object.keys(parsedCookies).some(
        (cookieLabel) => cookieLabel === name
    );

    if (!foundCookie) {
        log.debug({ cookies, name, signed }, 'Cookie does not exist.');

        return null;
    }

    const cookie = parsedCookies[name];

    log.debug({ cookie, cookies, name, signed }, 'Found cookie.');

    return cookie;
};

module.exports = {
    create,
    find,
};
