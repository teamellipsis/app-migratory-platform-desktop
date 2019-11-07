const AdmZip = require('adm-zip');
const fs = require('fs-extra');
const path = require('path');
const message = require(path.join(__dirname, '../const/message'));

process.on('message', (inMsg) => {
    console.log(__filename, inMsg);
    const { msg, ...args } = inMsg;
    if (msg === message.RECEIVE_APP_INIT) {
        this.receiveApp(args);
    } else if (msg === message.SEND_APP_INIT) {
        this.sendApp(args);
    }
});

this.receiveApp = (args) => {
    try {
        const appsDirPath = args.appsDirPath;
        const ipv4 = args.ipv4;
        const port = args.port;

        const socket = require('socket.io-client')(`http://${ipv4}:${port}`);
        socket.on('connect', () => {
            console.log('connect');
            socket.emit('request', { request: "request" });
        });

        socket.on('send', (data, ack) => {
            let zip = new AdmZip(data);

            if (ack) {
                ack();
            }

            zip.extractAllTo(appsDirPath, true);

            console.log("receiveApp-finished", args);
            process.send({ msg: message.RECEIVE_APP_FINISHED, error: null });
        });

        socket.on('disconnect', () => {
            console.log('disconnect');
        });
    } catch (error) {
        console.error("receiveApp-finished", args, error);
        process.send({ msg: message.RECEIVE_APP_FINISHED, error });
    }
};

this.sendApp = (args) => {
    try {
        const { appsDirPath, appName, ipv4, port } = args;
        const srcDir = path.join(appsDirPath, appName)

        let zip = new AdmZip();
        zip.addLocalFolder(srcDir, appName);

        const socket = require('socket.io-client')(`http://${ipv4}:${port}`, {
            reconnection: false,
        });

        socket.once('connect_error', (error) => {
            console.log('connect_error');
            process.send({ msg: message.SEND_APP_FINISHED, error: "CONNECT_ERROR", appName });
        });

        socket.on('connect', () => {
            console.log('connect');
            socket.emit('send', zip.toBuffer());
        });

        socket.on('received', (ack) => {
            ack();
            fs.removeSync(path.join(appsDirPath, appName));
            console.log("sendApp-finished", args);
            process.send({ msg: message.SEND_APP_FINISHED, error: null, appName });
        });

        socket.on('disconnect', () => {
            console.log('disconnect');
        });
    } catch (error) {
        console.error("sendApp-finished", args, error);
        process.send({ msg: message.SEND_APP_FINISHED, error });
    }
};
