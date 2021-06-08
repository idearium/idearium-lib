#!/usr/bin/env node
'use strict';

const pump = require('pump');
const structured = require('../index');

pump(process.stdin, structured(), process.stdout);
