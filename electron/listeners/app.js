const { ipcMain } = require('electron');
const path = require('path');
const Event = require('../../src/const/Event');
const { execFile } = require('child_process');
const { BrowserWindow } = require('electron');
const http = require('http');

ipcMain.on(Event.AM_OPEN_APP, (event, { appPath }) => {
    let serverFilePath = path.join(appPath, 'server.js');
    const child = execFile('node', [serverFilePath], (error, stdout, stderr) => {
        event.sender.send(Event.AM_OPEN_APP_FINISH, { error, stdout, stderr });
    });

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

function checkAndResend(window, url, options) {
    let req = http.request(options, (res) => {
        if (res.statusCode === 200) {
            window.loadURL(url);
        }
    });

    req.on('error', (err) => {
        setTimeout(() => {
            checkAndResend(window, url, options);
        }, 16);
    });
    req.end();
}
