const util = require('util');

module.exports.overrideLogging = (logFile) => {
    console.error = (msg, ...optionalParams) => {
        logFile.write(util.format(msg, ...optionalParams) + '\n');
        process.stderr.write(util.format(msg, ...optionalParams) + '\n');
    };

    console.warn = (msg, ...optionalParams) => {
        logFile.write(util.format(msg, ...optionalParams) + '\n');
        process.stdout.write(util.format(msg, ...optionalParams) + '\n');
    };

    console.info = (msg, ...optionalParams) => {
        logFile.write(util.format(msg, ...optionalParams) + '\n');
        process.stdout.write(util.format(msg, ...optionalParams) + '\n');
    };

    console.log = (msg, ...optionalParams) => {
        logFile.write(util.format(msg, ...optionalParams) + '\n');
        process.stdout.write(util.format(msg, ...optionalParams) + '\n');
    };

    console.debug = (msg, optionalParams) => {
        logFile.write(util.format(msg, ...optionalParams) + '\n');
        process.stdout.write(util.format(msg, ...optionalParams) + '\n');
    };
};
