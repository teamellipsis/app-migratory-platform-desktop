const path = require('path');
const fs = require('fs');
const log = require(path.join(__dirname, '../config/log'));

const mainWorkerLogFile = fs.createWriteStream('./main-worker.log', { flags: 'a' });
log.overrideLogging(mainWorkerLogFile);

module.exports.register = () => {
    require(path.join(__dirname, 'zip'));
    require(path.join(__dirname, 'app'));
    require(path.join(__dirname, 'devices'));
    console.log(`Main worker ${process.pid} registered`);
}

this.register();
