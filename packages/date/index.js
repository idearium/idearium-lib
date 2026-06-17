import { TZDate } from '@date-fns/tz';

const zones = {
    'Australia/ACT': 'Australia/Sydney',
    'Australia/NSW': 'Australia/Sydney',
    'Australia/NT': 'Australia/Darwin',
    'Australia/QLD': 'Australia/Brisbane',
    'Australia/SA': 'Australia/Adelaide',
    'Australia/TAS': 'Australia/Hobart',
    'Australia/VIC': 'Australia/Melbourne',
    'Australia/WA': 'Australia/Perth',
};

const timezoneFromState = ({ state }) => {
    const australianState = state.toUpperCase();
    const zone = zones[`Australia/${australianState}`];

    if (!zone) {
        throw new Error(
            `A timezone for the ${australianState} state could not be found.`
        );
    }

    return zone;
};

const formatDateWithTimeZone = ({
    date,
    locales = 'en-AU',
    options = { dateStyle: 'full', timeStyle: 'short' },
    timeZone,
} = {}) => {
    const tzDate = new TZDate(date, timeZone);
    return new Intl.DateTimeFormat(locales, { ...options, timeZone }).format(
        tzDate
    );
};

export { formatDateWithTimeZone, timezoneFromState, zones };
