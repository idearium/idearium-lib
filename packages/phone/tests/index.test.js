'use strict';

jest.mock('twilio');

const twilio = require('twilio');

// We mock the twilio library to not error on load.
// This allows us to test the required fields in our function.
twilio.mockImplementation(() => ({
    lookups: {
        v1: { phoneNumbers: () => ({ fetch: async () => {} }) },
    },
}));

const { parsePhoneNumber } = require('../');

it('throws an error if the country code is not provided', async () => {
    expect.assertions(1);

    await expect(parsePhoneNumber()).rejects.toThrow(
        'A country code is required.'
    );
});

it('throws an error if the country code is not provided', async () => {
    expect.assertions(2);

    await expect(parsePhoneNumber({})).rejects.toThrow(
        'A country code is required.'
    );

    await expect(parsePhoneNumber({ phoneNumber: '123' })).rejects.toThrow(
        'A country code is required.'
    );
});

it('throws an error if the phone number is not provided', async () => {
    expect.assertions(1);

    await expect(parsePhoneNumber({ countryCode: 'AU' })).rejects.toThrow(
        'A phone number is required.'
    );
});
