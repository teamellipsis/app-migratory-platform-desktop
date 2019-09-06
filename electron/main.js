const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const log = require(path.join(__dirname, 'config/log'));

const masterLogFile = fs.createWriteStream('./master.log', { flags: 'a' });
log.overrideLogging(masterLogFile);

const listeners = require('./listeners');
listeners.register();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        // Open the DevTools.
        // mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    });
}

function createChildProcess() {
    console.log(`Master ${process.pid} is running`);
    const mainChildProcess = childProcess.fork(path.join(__dirname, 'workers'));
    require('./workers/mainWorker').set(mainChildProcess);

    mainChildProcess.on('exit', (code, signal) => {
        console.log(`Main worker ${mainChildProcess.pid} died`);
    });
}

app.on('ready', () => {
    createWindow();

    createChildProcess();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});
