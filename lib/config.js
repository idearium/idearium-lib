'use strict';

const path = require('path');
const nconf = require('nconf');

class Config {

    /**
     * Constructor
     * @param  {String} dir      Config directory
     * @param  {Object} env      Scope to retrieve environment variables from
     * @return {Object}          Config instance
     */
    // eslint-disable-next-line no-process-env
    constructor (dir, env = process.env) {

        if (!dir) {
            throw new Error('dir parameter must be provided when creating a new Config instance.');
        }

        this.config = new nconf.Provider();
        this.config.use('memory');

        // Load in the config file.
        // eslint-disable-next-line global-require
        this.config.defaults(require(path.resolve(dir, 'config.js')));

        // Add hooks for environment flag
        if (env.NODE_ENV) {
            this.config.set(env.NODE_ENV, true);
        }

        // Setup the environment.
        this.config.set('env', env.NODE_ENV);

        // Always prefer ENV variables, over those loaded above.
        this.config.overrides(env);

    }

    /**
     * Set config keyed value
     * @param  {String} key   Key name
     * @param  {String} value Value
     * @return {Void}         Nothing.
     */
    set (key, value) {
        this.config.set(key, value);
    }

    /**
     * Get config keyed value
     * @param  {String} key   Key name
     * @return {String}       Value
     */
    get (key) {
        return this.config.get(key);
    }

    /**
     * Get a list of all the config values
     * @return {Object}     key value object
     */
    getAll () {

        const result = {};
        const { config } = this;

        let keys = [];

        Object.keys(config.stores).forEach((storeType) => {
            keys = keys.concat(Object.keys(config.stores[storeType].store).filter((key) => keys.indexOf(key) < 0));
        });

        // That we have all of the keys, loop through and get their values
        keys.sort().forEach((key) => {
            result[key] = config.get(key);
        });

        return result;

    }

}

module.exports = Config;
