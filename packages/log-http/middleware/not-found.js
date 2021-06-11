'use strict';

module.exports = () => (req, res) =>
    res.status(404).end(`Cannot ${req.method} ${req.url}`);
