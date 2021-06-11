'use strict';

const escape = require('escape-html');

module.exports = () => (req, res) =>
    res.status(404).end(`Cannot ${escape(req.method)} ${escape(req.url)}`);
