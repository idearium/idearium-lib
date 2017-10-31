'use strict';

class Api {

    /**
     * The api constructor.
     * @param {String} baseUrl A base api url.
     * @param {Object} [defaults={}] Default request module parameters that will be passed to all endpoints.
     * @return {Void} Adds a baseUrl and defaults property to the class.
     */
    constructor (baseUrl, defaults = {}) {

        if (!baseUrl) {
            throw new Error('A baseUrl must be provided');
        }

        this.baseUrl = baseUrl;
        this.defaults = defaults;

    }

    /**
     * Request an Api endpoint.
     * @param {String} endpoint The api endpoint.
     * @param {Object} [options={}] Override or add request module options.
     * @return {Object} Returns request module options.
     */
    requestApi (endpoint, options = {}) {
        return Object.assign({}, this.defaults, options, { uri: `${this.baseUrl}${endpoint}` });
    }

    /**
     * Add an Api endpoint.
     * @param {String} name The name of the endpoint.
     * @param {Object} endpoints Object containing endpoint functions to generate the request module options.
     * @return {Void} Adds the endpoint to the class.
     */
    addEndpoint (name, endpoints) {
        this[name] = endpoints;
    }

}

module.exports = Api;
