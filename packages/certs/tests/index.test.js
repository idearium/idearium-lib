'use strict';

const os = require('os');
const { loadProvidedCerts, loadAllCerts } = require('../');

jest.mock('fs');

beforeEach(() => {
    require('fs').__setMockFiles({
        '/ssl/one.crt': 'data-one',
        '/ssl/two.crt': 'data-two',
        '/etc/ca-certificates.conf': `# test files${os.EOL}/usr/share/ca-certificates/one-cert.crt${os.EOL}/usr/share/ca-certificates/two-cert.crt`,
        '/usr/share/ca-certificates/one-cert.crt': 'one-cert-content',
        '/usr/share/ca-certificates/two-cert.crt': 'two-cert-content',
    });
});

it('will load provided certs', async () => {
    const certs = await loadProvidedCerts();
    expect(certs).toEqual(['data-one', 'data-two']);
});

it('will load all certs', async () => {
    const certs = await loadAllCerts();

    expect(certs).toEqual([
        'data-one',
        'data-two',
        'one-cert-content',
        'two-cert-content',
    ]);
});
