'use strict';

const checkDefaults = ({ group, list, lists } = {}) =>
    lists[group] && lists[group][list];

module.exports = ({ lists = [] } = {}) => ({
    // Get an array of keys from the lib lists file.
    getKeys({ group, list } = {}) {
        if (!checkDefaults({ group, list, lists })) {
            return [];
        }

        return Object.keys(lists[group][list]);
    },

    // Get an array of values from the lib lists file.
    getList({ group, list } = {}) {
        if (!checkDefaults({ group, list, lists })) {
            return [];
        }

        return lists[group][list];
    },

    // Get the value of a list, from a group.
    getListValue({ group, list, key } = {}) {
        if (
            !checkDefaults({ group, list, lists }) ||
            !lists[group][list][key]
        ) {
            return null;
        }

        return lists[group][list][key];
    },

    // Get an array of values from the lib lists file, formatted for a select field.
    getSelectList({ group, list } = {}) {
        if (!checkDefaults({ group, list, lists })) {
            return [];
        }

        return Object.keys(lists[group][list]).map((field) => ({
            label: lists[group][list][field],
            value: field
        }));
    },

    // Get an array of keys from the lib lists file, formatted for a select field.
    getSelectListWithKeys({ group, list } = {}) {
        if (!checkDefaults({ group, list, lists })) {
            return [];
        }

        return Object.keys(lists[group][list]).map((key) => ({
            label: key,
            value: key
        }));
    },

    // Get an array of values from the lib lists file, formatted for a select field.
    getSelectListWithValues({ group, list } = {}) {
        if (!checkDefaults({ group, list, lists })) {
            return [];
        }

        return Object.keys(lists[group][list]).map((key) => ({
            label: lists[group][list][key],
            value: lists[group][list][key]
        }));
    },

    // Get an array of values from the lib lists file.
    getValues({ group, list } = {}) {
        if (!checkDefaults({ group, list, lists })) {
            return [];
        }

        return Object.keys(lists[group][list]).map(
            (field) => lists[group][list][field]
        );
    }
});
