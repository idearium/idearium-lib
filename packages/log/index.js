'use strict';

const pino = require('pino');
const defaults = require('./defaults');

const sourceLocationKey = 'logging.googleapis.com/sourceLocation';

module.exports = (options = {}) =>
    pino(
        Object.assign({}, defaults, options),
        options.stream || pino.destination(1)
    ).child({
        [`${sourceLocationKey}`]: options.sourceLocation || {
            file: Error()
                .stack.split('\n')
                .slice(2)
                .filter(
                    (s) =>
                        !s.includes('node_modules/pino') &&
                        !s.includes('node_modules\\pino')
                )[0]
                .match(/\((.*?):/)[1]
        }
    });
