'use strict';

const logger = require('./');

const multi = (log) => {
    const multiLogger = (...args) => {
        if (args.length !== 2) {
            throw new Error('You must provide data and message parameters');
        }

        const [data, message] = args;

        const composedData = {};
        const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
        const loggedLevels = levels.filter(
            (level) =>
                Object.keys(data).includes(level) && log.isLevelEnabled(level)
        );
        const loggedLevel = loggedLevels[loggedLevels.length - 1];

        // No levels are enabled if LOG_ENABLED is true
        if (!loggedLevels.length) {
            return null;
        }

        loggedLevels.forEach((level) => {
            Object.assign(composedData, data[level]);
        });

        log[loggedLevel](composedData, message);

        return { data: composedData, level: loggedLevel };
    };

    return multiLogger;
};

const multiLog = (options = {}) => {
    const log = logger({
        sourceLocation: options.sourceLocation || {
            file: Error()
                .stack.split('\n')
                .slice(2)
                .filter(
                    (s) =>
                        !s.includes('node_modules/pino') &&
                        !s.includes('node_modules\\pino')
                )[0]
                .match(/\((.*?):/)[1],
        },
        ...options,
    });

    return multi(log);
};

module.exports = multiLog;
