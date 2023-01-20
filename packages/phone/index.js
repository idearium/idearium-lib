'use strict';

const accountSid = process.env.TWILIO_LOOKUP_API_ACCOUNT_SID;
const authToken = process.env.TWILIO_LOOKUP_API_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const parsePhoneNumber = async ({ countryCode, phoneNumber } = {}) => {
    if (!countryCode) {
        throw new Error('A country code is required.');
    }

    if (!phoneNumber) {
        throw new Error('A phone number is required.');
    }

    const phone = await client.lookups.v1
        .phoneNumbers(phoneNumber)
        .fetch({ countryCode });

    return phone;
};

module.exports = { parsePhoneNumber };
