const { ipcMain } = require('electron');
const path = require('path');
const Event = require('../../src/const/Event');
const { BrowserWindow } = require('electron');
const http = require('http');
const cluster = require('cluster');
const message = require('../const/message');

ipcMain.on(Event.AM_OPEN_APP, (event, { appPath }) => {
    let serverFilePath = path.join(appPath, 'server.js');
    let worker = cluster.fork({ SERVER_FILE_PATH: serverFilePath, APP_PATH: appPath });

    worker.once('online', () => {
        console.log(`Server ${worker.id} online`);
    });

    worker.once('listening', (address) => {
        event.sender.send(Event.AM_OPEN_APP_FINISH, { error: null });
        console.log(`Server listening on port:${address.port}`);

        let newWindow = new BrowserWindow({
            width: 800,
            height: 600,
            show: false,
        });

        // TODO(Remove hardcoded URL)
        let url = 'http://localhost:3001';
        let options = {
            hostname: 'localhost',
            port: '3001',
            method: 'GET',
        };

        checkAndResend(newWindow, url, options);

        newWindow.on('ready-to-show', () => {
            newWindow.show();
        });

        newWindow.on('closed', () => {
            newWindow = null
        });
    });

    worker.once('message', (msg) => {
        if (msg.msg === message.SERVER_ERROR) {
            event.sender.send(Event.AM_OPEN_APP_FINISH, { error: msg.error });
        }
    });
});

function checkAndResend(window, url, options) {
    let req = http.request(options, (res) => {
        if (res.statusCode === 200) {
            window.loadURL(url);
        }
    });

    req.on('error', (err) => {
        setTimeout(() => {
            checkAndResend(window, url, options);
        }, 16); // Since, devices display 60 frames per second
    });
    req.end();
}
