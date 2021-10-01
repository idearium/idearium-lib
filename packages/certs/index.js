'use strict';

const { extname, resolve: resolvePath } = require('path');
const fs = require('fs');
const os = require('os');
const https = require('https');

/**
 * Read a directory for a list of custom CA certs to load.
 * @param {String} path An path containing certs
 * @returns {Promise} An array of paths to custom CA certs.
 */
const customCaPath = (path = '/ssl') =>
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

/**
 * Given an array of certificate paths, load them and return the results.
 * @param {Array} certPaths An array of paths to CA certs
 * @returns {Promise} An array containing each cert.
 */
const loadFiles = (certPaths) =>
    Promise.all(
        certPaths.map(
            (file) =>
                new Promise((resolve, reject) => {
                    fs.readFile(file, 'utf8', (readErr, cert) => {
                        if (readErr) {
                            return reject(readErr);
                        }

                        return resolve(cert);
                    });
                })
        )
    );

/**
 * Read /etc/ca-certificates for a list of OS distributed CA certs to load.
 * @returns {Promise} An array of paths to OS distributed CA certs.
 */
const osCaPaths = () =>
    new Promise((resolve, reject) => {
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
        });
    });

module.exports = {
    loadAllCerts: (path) =>
        new Promise((resolve, reject) => {
            // Load the custom and OS distributed CA cert paths.
            Promise.all([customCaPath(path), osCaPaths()])
                .then(([customCas, osCas]) => [].concat(customCas, osCas))
                .then((certPaths) => loadFiles(certPaths))
                .then((certs) => {
                    // Replace the global agents CA certs.
                    https.globalAgent.options.ca = certs;

                    return resolve(certs);
                })
                .catch(reject);
        }),
    loadProvidedCerts: (path) =>
        customCaPath(path).then((paths) => loadFiles(paths)),
};
