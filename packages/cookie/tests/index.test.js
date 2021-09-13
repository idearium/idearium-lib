'use strict';

const { create, find } = require('../');

test('it can create cookies', () => {
    const now = new Date();
    const serialized = create({ cookie: 'cookie string', name: 'test' });

    console.log('serialized', serialized, typeof serialized);

    expect(serialized).toContain('cookie%20string');
    expect(serialized).not.toContain(`Expires=${now.toUTCString()}`);
    expect(serialized).toContain('HttpOnly');
    expect(serialized).toContain('Max-Age=3600');
    expect(serialized).toContain('Path=/');
});

test('it can override the create options', () => {
    const now = new Date();
    const serialized = create({
        cookie: 'cookie string',
        expires: now,
        httpOnly: false,
        maxAge: 1,
        name: 'test',
        path: '/test',
    });

    expect(serialized).toContain('cookie%20string');
    expect(serialized).toContain(`Expires=${now.toUTCString()}`);
    expect(serialized).not.toContain('HttpOnly');
    expect(serialized).toContain('Max-Age=1');
    expect(serialized).toContain('Path=/test');
});

test('it can override the cookie library create options', () => {
    const serialized = create({
        cookie: 'cookie string',
        domain: '.test.local',
        name: 'test',
        sameSite: true,
        secure: true,
    });

    expect(serialized).toContain('cookie%20string');
    expect(serialized).toContain('Domain=.test.local');
    expect(serialized).toContain('Secure');
    expect(serialized).toContain('SameSite=Strict');
});

test('it can find cookies', () => {
    const foundCookie = find({
        cookies: 'test=test%20string',
        name: 'test',
    });

    expect(foundCookie).toContain('test string');
});

test('it can override the cookie library serialize options', () => {
    const foundCookie = find({
        cookies: 'test=test%20string',
        decode: (val) => val,
        name: 'test',
    });

    expect(foundCookie).toContain('test%20string');
});
