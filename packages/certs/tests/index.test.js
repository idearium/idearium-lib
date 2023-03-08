'use strict';

const os = require('os');
const { loadCerts, loadOsCerts } = require('../');

jest.mock('fs');

beforeEach(() => {
    require('fs').__setMockFiles({
        '/ssl/ca/one.crt': 'ca-one-data',
        '/ssl/ca/two.crt': 'ca-two-data',
        '/ssl/ca/three.crt': 'ca-three-data',
        '/ssl/mq.crt': 'ssl-mq-crt-data',
        '/ssl/mq.key': 'ssl-mq-key-data',
        '/ssl/redis.crt': 'redis-crt-data',
        '/ssl/redis.key': 'redis-key-data',
        '/etc/ca-certificates.conf': `# test files${os.EOL}/usr/share/ca-certificates/one-cert.crt${os.EOL}/usr/share/ca-certificates/two-cert.crt`,
        '/usr/share/ca-certificates/one-cert.crt': 'one-cert-content',
        '/usr/share/ca-certificates/two-cert.crt': 'two-cert-content',
        '/certs/mq.crt': 'certs-mq-crt-data',
        '/certs/mq.key': 'certs-mq-key-data',
        '/tls/redis.crt': 'tls-redis-crt-data',
        '/tls/mq.key': 'tls-mq-key-data',
        '/tls/mq.txt': 'tls-mq-txt-data',
        '/tls/ca/ca-one.crt': 'tls-ca-one-data',
        '/tls/ca/ca-two.crt': 'tls-ca-two-data',
    });
});

it('will load ca certs', async () => {
    const certs = await loadCerts();
    expect(certs).toHaveProperty('ca', [
        'ca-one-data',
        'ca-two-data',
        'ca-three-data',
    ]);
});

it('will load custom certs', async () => {
    const certs = await loadCerts();
    expect(certs).toHaveProperty('ca', [
        'ca-one-data',
        'ca-two-data',
        'ca-three-data',
    ]);
    expect(certs).toHaveProperty('certs', {
        mq: { crt: 'ssl-mq-crt-data', key: 'ssl-mq-key-data' },
        redis: { crt: 'redis-crt-data', key: 'redis-key-data' },
    });
});

it('will load only key and crt files', async () => {
    const certs = await loadCerts('/tls');
    expect(certs).toHaveProperty('ca', ['tls-ca-one-data', 'tls-ca-two-data']);
    expect(certs).toHaveProperty('certs', {
        mq: { key: 'tls-mq-key-data' },
        redis: { crt: 'tls-redis-crt-data' },
    });
});

it("will return an empty ca array if the ca directory doesn't exist", async () => {
    const certs = await loadCerts('/certs');

    expect(certs).toHaveProperty('ca', []);
    expect(certs).toHaveProperty('certs', {
        mq: { crt: 'certs-mq-crt-data', key: 'certs-mq-key-data' },
    });
});

it('will load OS provided certs', async () => {
    const certs = await loadOsCerts();

    expect(certs).toEqual(['one-cert-content', 'two-cert-content']);
});
