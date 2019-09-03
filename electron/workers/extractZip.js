const cluster = require('cluster');
const AdmZip = require('adm-zip');
const message = require('../const/message');

if (cluster.isWorker) {
    process.on('message', (msg) => {
        if (msg.msg === message.EXECUTE) {
            const { func, ...args } = msg;
            this[func](args);
        }
    });
}

this.extractZip = (args) => {
    try {
        let filePath = args.filePath;
        let targetPath = args.targetPath;

        var zip = new AdmZip(filePath);
        zip.extractAllTo(targetPath, true);
        process.send({ msg: message.EXTRACT_FINISHED, error: null });
    } catch (error) {
        process.send({ msg: message.EXTRACT_FINISHED, error });
    }
};
