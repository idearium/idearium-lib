'use strict';

module.exports = () => (err, req, res, next) => {
    res.err = err;

    return next(err);
};
