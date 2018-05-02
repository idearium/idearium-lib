'use strict';

const apm = require('../common/apm');

module.exports = (req, res, next) => {

    const { user } = req;

    // No user to set context for. (Not a linz route).
    if (!user) {
        return next();
    }

    const {
        _id: id,
        email,
        username,
    } = user;

    apm.setUserContext({
        email,
        id,
        username,
    });

    return next();

};
