const { ipcMain } = require('electron');
const path = require('path');
const Event = require('../../src/const/Event');
const { BrowserWindow } = require('electron');
const message = require('../const/message');
const childProcess = require('child_process');

ipcMain.on(Event.AM_OPEN_APP, (event, { appPath }) => {
    const serverFilePath = path.join(appPath, 'server.js');
    const worker = childProcess.fork(serverFilePath);

    // Only listen for first `error` or `listening` message
    worker.once('message', (inMsg) => {
        const { msg } = inMsg;
        if (msg === message.SERVER_ERROR) {
            const { error } = inMsg;
            event.sender.send(Event.AM_OPEN_APP_FINISH, { error });

        } else if (msg === message.SERVER_LISTENING) {
            const { server } = inMsg;
            console.log(`Server listening on port:${server.port}`);
            event.sender.send(Event.AM_OPEN_APP_FINISH, { error: null });

            let newWindow = new BrowserWindow({
                width: 800,
                height: 600,
                show: false,
            });

            let url = `http://localhost:${server.port}`;
            newWindow.loadURL(url);

            newWindow.on('ready-to-show', () => {
                newWindow.show();
            });

            newWindow.on('closed', () => {
                newWindow = null
            });
        }
    });

    worker.on('exit', (code, signal) => {
        console.log(`Worker ${worker.pid} exit with code:${code}, signal:${signal}`);
    });
});
