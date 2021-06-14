'use strict';

const escape = require('escape-html');

module.exports = () => (req, res) =>
    res.status(404).send(`Cannot ${escape(req.method)} ${escape(req.url)}`);
