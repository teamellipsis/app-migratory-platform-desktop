const AdmZip = require('adm-zip');
const path = require('path');
const message = require(path.join(__dirname, '../const/message'));

process.on('message', (inMsg) => {
    console.log(inMsg);
    const { msg, ...args } = inMsg;
    if (msg === message.RECEIVE_APP_INIT) {
        this.receiveApp(args);
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
