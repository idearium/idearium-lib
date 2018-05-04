'use strict';

module.exports = (req, res, next) => {

    const apm = require('../common/apm');
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
