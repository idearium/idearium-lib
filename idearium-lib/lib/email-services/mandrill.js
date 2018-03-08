'use strict';

const mandrill = require('mandrill-api/mandrill');
const moment = require('moment');

/**
 * Send email request to Mandrill
 * @param  {String} apiKey     Mandrill API key
 * @param  {Object}   message  Mandrill API message object (see https://mandrillapp.com/api/docs/messages.JSON.html for other message properties)
 * @param  {Function} callback Callback function
 * @return {Void}              Void.
 */
const sendRequestToMandrill = function sendRequestToMandrill (apiKey, message, callback) {

    const mandrillClient = new mandrill.Mandrill(apiKey);
    const data = { async: true };

    // Convert message.to string to an array.
    if (!Array.isArray(message.to)) {
        message.to = message.to.split(',').map(email => ({ email }));
    }

    // Convert message.fromEmail to message.from_email.
    // eslint-disable-next-line camelcase
    message.from_email = message.fromEmail;
    delete message.fromEmail;

    // Convert message.sendAt to message.send_at if provided.
    if (message.sendAt) {

        // eslint-disable-next-line camelcase
        data.send_at = message.sendAt;
        delete message.sendAt;

    }

    // Now that we've formatted the message object, add it to the data struct.
    data.message = message;

    mandrillClient.messages.send(data, result => callback(null, result), callback);

};

class Mandrill {

    /**
     * Construct an instance of the Mandrill class.
     * @param  {String} apiKey Mandrill API key specific.
     * @return {Object}        Mandrill instance.
     */
    constructor (apiKey) {

        if (!apiKey) {
            throw new Error('apiKey parameter must be provided when creating a new Email instance.');
        }

        this.apiKey = apiKey;

        return this;

    }

    /**
     * Send an email using the Mandrill service.
     * @param  {Object}   message  Message object
     * @param  {Function} callback Callback function
     * @return {Void}              Nothing.
     */
    send (message, callback) {

        return sendRequestToMandrill(this.apiKey, message, callback);

    }

    // ----
    // Static methods
    // ----

    /**
     * Given a Moment object, format a string that Mandrill can use to send at a specific time.
     * @param {Moment} momentInTime A moment in UTC.
     * @return {String}             A formatted string represent a time in UTC.
     */
    static sendAt (momentInTime) {

        if (!moment.isMoment(momentInTime)) {
            throw new Error('momentInTime must be an instance of moment');
        }

        // Mandrill requirements send_at to be in the format `YYYY-MM-DD HH:MM:SS`.
        // https://mandrillapp.com/api/docs/messages.JSON.html#method=send
        return momentInTime.utc().format('YYYY-MM-DD HH:mm:ss');

    }

    /**
     * Given a string, validate it meets Mandrill's requirements for the sendAt property.
     * @param {String} utcString A string to validate.
     * @return {Boolean}         `true` for valid, `false` for invalid.
     */
    static validateSendAt (utcString) {

        // A regular express that will match `YYYY-MM-DD HH:mm:ss`.
        // https://regex101.com/r/Ajs0uX/2
        const re = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/;

        return re.test(String(utcString)) && moment.utc(String(utcString), 'YYYY-MM-DD HH:mm:ss').isValid();

    }

}

module.exports = Mandrill;
