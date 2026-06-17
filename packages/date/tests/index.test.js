import { describe, it, expect } from 'vitest';
import { formatDateWithTimeZone, timezoneFromState, zones } from '../index.js';

describe('timezoneFromState', () => {
    it('is a function', () => {
        expect(typeof timezoneFromState).toBe('function');
    });

    it('returns Australia/Sydney for NSW', () => {
        expect(timezoneFromState({ state: 'NSW' })).toBe('Australia/Sydney');
    });

    it('returns Australia/Sydney for ACT', () => {
        expect(timezoneFromState({ state: 'ACT' })).toBe('Australia/Sydney');
    });

    it('returns Australia/Melbourne for VIC', () => {
        expect(timezoneFromState({ state: 'VIC' })).toBe('Australia/Melbourne');
    });

    it('returns Australia/Brisbane for QLD', () => {
        expect(timezoneFromState({ state: 'QLD' })).toBe('Australia/Brisbane');
    });

    it('returns Australia/Adelaide for SA', () => {
        expect(timezoneFromState({ state: 'SA' })).toBe('Australia/Adelaide');
    });

    it('returns Australia/Perth for WA', () => {
        expect(timezoneFromState({ state: 'WA' })).toBe('Australia/Perth');
    });

    it('returns Australia/Hobart for TAS', () => {
        expect(timezoneFromState({ state: 'TAS' })).toBe('Australia/Hobart');
    });

    it('returns Australia/Darwin for NT', () => {
        expect(timezoneFromState({ state: 'NT' })).toBe('Australia/Darwin');
    });

    it('is case-insensitive', () => {
        expect(timezoneFromState({ state: 'nsw' })).toBe('Australia/Sydney');
    });

    it('throws for an unknown state', () => {
        expect(() => timezoneFromState({ state: 'NZ' })).toThrow(
            /A timezone for the NZ state could not be found./
        );
    });

    it('throws for an empty string', () => {
        expect(() => timezoneFromState({ state: '' })).toThrow(
            /A timezone for the  state could not be found./
        );
    });
});

describe('zones', () => {
    it('is the expected map object', () => {
        expect(zones['Australia/NSW']).toBe('Australia/Sydney');
    });
});

describe('formatDateWithTimeZone', () => {
    it('is a function', () => {
        expect(typeof formatDateWithTimeZone).toBe('function');
    });

    it('applies defaults using en-AU and the given timeZone', () => {
        expect(
            formatDateWithTimeZone({
                date: new Date('2024-01-15T00:00:00Z'),
                timeZone: 'Australia/Sydney',
            })
        ).toBe('Monday, 15 January 2024 at 11:00 am');
    });

    it('applies the timeZone to shift the rendered time', () => {
        expect(
            formatDateWithTimeZone({
                date: new Date('2024-01-15T00:00:00Z'),
                timeZone: 'Australia/Perth',
            })
        ).toBe('Monday, 15 January 2024 at 8:00 am');
    });

    it('honors a custom locales', () => {
        expect(
            formatDateWithTimeZone({
                date: new Date('2024-01-15T00:00:00Z'),
                locales: 'en-US',
                timeZone: 'Australia/Sydney',
            })
        ).toBe('Monday, January 15, 2024 at 11:00 AM');
    });

    it('honors custom options', () => {
        expect(
            formatDateWithTimeZone({
                date: new Date('2024-01-15T00:00:00Z'),
                options: { dateStyle: 'long' },
                timeZone: 'Australia/Sydney',
            })
        ).toBe('15 January 2024');
    });

    it('throws a RangeError for an invalid timeZone', () => {
        expect(() =>
            formatDateWithTimeZone({
                date: new Date('2024-01-15T00:00:00Z'),
                timeZone: 'Invalid/Zone',
            })
        ).toThrow(RangeError);
    });
});
