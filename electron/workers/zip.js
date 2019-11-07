const AdmZip = require('adm-zip');
const path = require('path');
const message = require(path.join(__dirname, '../const/message'));

process.on('message', (inMsg) => {
    console.log(__filename, inMsg);
    const { msg, func, ...args } = inMsg;
    if (msg === message.EXECUTE) {
        if (typeof this[func] === 'function') {
            this[func](args);
        }
    }
});

this.extractZip = (args) => {
    try {
        let filePath = args.filePath;
        let targetPath = args.targetPath;

        var zip = new AdmZip(filePath);
        zip.extractAllTo(targetPath, true);
        console.log("extractZip-finished", args);
        process.send({ msg: message.EXTRACT_FINISHED, error: null });
    } catch (error) {
        console.error("extractZip-finished", args, error);
        process.send({ msg: message.EXTRACT_FINISHED, error });
    }
};

this.packageDir = (args) => {
    try {
        let srcDir = args.srcDir;
        let targetDir = args.targetDir;
        let appName = args.appName;

        var zip = new AdmZip();
        zip.addLocalFolder(srcDir, appName);
        zip.writeZip(path.join(targetDir, `${appName}.zip`));
        console.log("packageDir-finished", args);
        process.send({ msg: message.PACKAGE_FINISHED, error: null });
    } catch (error) {
        console.error("packageDir-finished", args, error);
        process.send({ msg: message.PACKAGE_FINISHED, error });
    }
};
