'use strict';

const textSort = ({ array = [], asc = true, sortValue = (title) => title }) => {
    const collator = new Intl.Collator();

    return [...array].sort((a, b) => {
        if (!asc) {
            return collator.compare(sortValue(b), sortValue(a));
        }

        return collator.compare(sortValue(a), sortValue(b));
    });
};

module.exports = textSort;
