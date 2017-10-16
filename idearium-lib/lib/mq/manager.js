'use strict';

const { EventEmitter } = require('events');
const Loader = require('../loader');

class Manager extends EventEmitter {

    constructor (path) {

        /* eslint-disable padded-blocks */
        if (!path) {
            throw new Error('The path parameter is required');
        }
        /* eslint-enable padded-blocks */

        // Instantiate super class.
        super();

        // We'll store the loaded messages here.
        this.messages = {};

        // We'll store the path for later on
        this.path = path;

        // Load in the messages straight away.
        this.load();

    }

    load () {

        // Let's attempt to the messages in straight away.
        return this.loader.load(this.path).then((messages) => {

            // Add the messages to our class instance.
            this.messages = messages;

            // Emit an event so implementing code can proceed.
            this.emit('load');

        });

    }

    /**
     * Return an instance of the Loader class, configured as required.
     * @return {Loader} An instance of the Loader class.
     */
    // eslint-disable-next-line no-restricted-syntax
    get loader () {

        if (!this.loaderInstance) {

            this.loaderInstance = new Loader();
            this.loaderInstance.camelCase = false;

        }

        return this.loaderInstance;

    }

    /**
     * Register message queue consumers
     * @return {[type]} [description]
     */
    registerConsumers () {

        const { messages } = this;

        return Promise.all(Object.keys(messages)
            .filter(messageName => typeof messages[messageName].consume !== 'undefined')
            .map(messageName => messages[messageName].consume()));

    }

    /**
     * Publish a message
     * @param  {String} messageName Message name (should match the name of the message file)
     * @return {Promise}            A promise that will resolve when the message has published, or be rejected if an error occurs.
     */
    publish (messageName, ...args) {

        return new Promise((resolve, reject) => {

            /* eslint-disable padded-blocks */
            if (!this.messages[messageName]) {
                return reject(new Error(`"${messageName}" message is not defined.`));
            }
            /* eslint-enable padded-blocks */

            /* eslint-disable padded-blocks */
            if (!this.messages[messageName].publish) {
                return reject(new Error(`"${messageName}".publish is not defined.`));
            }
            /* eslint-enable padded-blocks */

            // Remove first argument and publish.
            const publishPromise = this.messages[messageName].publish.apply(this, args);

            // If a promise is returned by the messages publish function, return it.
            if (publishPromise instanceof Promise) {

                return publishPromise
                    .then(resolve)
                    .catch(reject);

            }

            // Otherwise, assume everything went okay.
            return resolve();

        });

    }

}

module.exports = Manager;
