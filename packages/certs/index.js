'use strict';

const { basename, extname, join, resolve: resolvePath } = require('path');
const fs = require('fs');
const os = require('os');

const customCaPath = (path) =>
    new Promise((resolve, reject) => {
        fs.readdir(path, (err, customCas) => {
            if (err) {
                return reject(err);
            }

            return resolve(
                customCas.map((caPath) => resolvePath(path, caPath))
            );
        });
    });

const loadFiles = async (certPaths) => {
    const results = {};
    await Promise.all(
        certPaths.map((file) =>
            fs.readFile(file, 'utf8', (readErr, cert) => {
                if (readErr) {
                    throw readErr;
                }

                results[file] = cert;
            })
        )
    );

    return results;
};

const osCaPaths = () =>
    new Promise((resolve, reject) =>
        fs.readFile('/etc/ca-certificates.conf', (err, content) => {
            if (err) {
                return reject(err);
            }

            // Get a list of all mozilla certs.
            return resolve(
                content
                    .toString()
                    .split(os.EOL)
                    .filter(
                        (line) =>
                            line.substr(0, 1) !== '#' &&
                            extname(line) === '.crt'
                    )
                    .map((file) =>
                        resolvePath('/usr/share/ca-certificates/', file)
                    )
            );
        })
    );

module.exports = {
    loadOsCerts: async () => {
        const osCertPaths = await osCaPaths();
        const osCertContents = await loadFiles(osCertPaths);
        return Object.values(osCertContents);
    },
    loadCerts: async (path = '/ssl') => {
        const [caPaths, customCertPaths] = await Promise.all([
            customCaPath(join(path, 'ca')),
            customCaPath(path),
        ]);
        const [caCerts, customCerts] = await Promise.all([
            loadFiles(caPaths),
            loadFiles(
                customCertPaths.filter((certPath) =>
                    ['.crt', '.key'].includes(extname(certPath))
                )
            ),
        ]);
        const certs = {};

        for (const [certPath, certContent] of Object.entries(customCerts)) {
            const ext = extname(certPath).replace('.', '');
            const file = basename(certPath, extname(certPath));

            if (!certs[file]) {
                certs[file] = {};
            }

            certs[file][ext] = certContent;
        }

        return { ca: Object.values(caCerts), certs };
    },
};
