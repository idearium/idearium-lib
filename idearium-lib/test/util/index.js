'use strict';

const {
    mkdir,
    rm,
    touch,
} = require('shelljs');
const rimraf = require('rimraf');
const path = require('path');

const configPath = path.join(process.cwd(), 'config');
const logPath = path.join(process.cwd(), 'logs');

/**
 * Make a path if it doesn't already exist.
 * @param {String} dir The path.
 * @param {Object} options The options.
 * @param {Boolean} [options.clean=true] Optionally wipe the directory.
 * @return {Promise} Makes the path.
 */
const makePath = (dir, options) => new Promise((resolve, reject) => {

    const settings = Object.assign({}, { clean: true }, options);

    // Create the directory if it doesn't already exist.
    mkdir('-p', dir);

    if (!settings.clean) {
        return resolve();
    }

    // Wipe all the files in the directory.
    rimraf(dir, () => (err) => {

        if (err) {
            return reject(err);
        }

        return resolve();

    });

});

/**
 * Make a file.
 * @param {String} dir The file path.
 * @param {Object} options The options.
 * @param {Boolean} [options.clean=true] Optionally wipe the file.
 * @param {Boolean} [options.content='module.exports = {}'] Optionally provide file contents.
 * @return {Promise} Makes the file.
 */
const makeFile = (dir, options) => new Promise((resolve) => {

    const settings = Object.assign({}, {
        clean: true,
        content: 'module.exports = {}',
    }, options);

    if (settings.clean) {
        rm(dir);
    }

    touch(dir);
    // Add the content to the file.
    settings.content.to(dir);

    return resolve();

});


const removePath = dir => Promise.resolve(rm('-rf', dir));

module.exports.makeConfigs = (content, options) => makePath(configPath, options.path)
    .then(() => makeFile(`${configPath}/config.js`, options.file));

module.exports.makeLogs = options => makePath(logPath, options.path);

module.exports.cleanUp = Promise.all([
    removePath(configPath),
    removePath(logPath),
]);
