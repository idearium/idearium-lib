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

        return Object.keys(lists[group][list]).map(
            (field) => lists[group][list][field]
        );
    },

    // Get the value of a list, from a group.
    getListValue({ group, list, value } = {}) {
        if (
            !checkDefaults({ group, list, lists }) ||
            !lists[group][list][value]
        ) {
            return null;
        }

        return lists[group][list][value];
    },

    // Get an array of values from the lib lists file, formatted for a select field.
    getSelectList({ group, list } = {}) {
        if (!checkDefaults({ group, list, lists })) {
            return [];
        }

        return Object.keys(lists[group][list]).map((field) => ({
            label: lists[group][list][field],
            value: lists[group][list][field]
        }));
    },

    // Get an array of values from the lib lists file, formatted for a select field.
    getSelectListWithKeys({ group, list } = {}) {
        if (!checkDefaults({ group, list, lists })) {
            return [];
        }

        return Object.keys(lists[group][list]).map((field) => ({
            label: lists[group][list][field],
            value: field
        }));
    }
});
