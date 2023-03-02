const log = require('@idearium/log')();

const composeData = (data, message) => {
    const composedData = {};
    const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
    const loggedLevels = levels.filter(
        (level) =>
            Object.keys(data).includes(level) && log.isLevelEnabled(level)
    );
    const [loggedLevel] = loggedLevels;

    loggedLevels.forEach((level) => {
        Object.assign(composedData, data[level]);
    });

    log[loggedLevel](composedData, message);

    return { data: composedData, level: loggedLevel };
};

module.exports = composeData;
