'use strict';

const {
    mkdir,
    rm,
    ShellString,
} = require('shelljs');
const path = require('path');

const baseDir = process.cwd();
const configPath = path.join(baseDir, 'config');
const logPath = path.join(baseDir, 'logs');

const removePath = dir => Promise.resolve(rm('-rf', dir));

/**
 * Make a path if it doesn't already exist.
 * @param {String} dir The path.
 * @return {Promise} Makes the path.
 */
const makePath = (dir) => {

    // Create the directory if it doesn't already exist.
    mkdir('-p', dir);

    return Promise.resolve();

};

/**
 * Make a file.
 * @param {String} dir The file path.
 * @param {Object} options The options.
 * @param {Boolean} [options.clean=false] Optionally wipe the file.
 * @param {Boolean} [options.content='module.exports = {}'] Optionally provide file contents.
 * @return {Promise} Makes the file.
 */
const makeFile = (dir, options) => {

    const settings = Object.assign({}, {
        clean: false,
        content: 'module.exports = {}',
    }, options);

    // eslint-disable-next-line new-cap
    ShellString(settings.content).to(dir);

    return Promise.resolve();

};

/**
 * Clean up the data after using it.
 * @returns {Promise} Removes the test paths.
 */
const cleanUp = () => Promise.all([
    removePath(configPath),
    removePath(logPath),
]);

module.exports = {
    cleanUp,
    logPath,
    makeConfigs: (content, options) => makePath(configPath)
        .then(() => makeFile(`${configPath}/config.js`, Object.assign({}, options, { content }))),
    makeFile,
    makeLogs: () => makePath(logPath),
    makePath,
    removePath,
};
