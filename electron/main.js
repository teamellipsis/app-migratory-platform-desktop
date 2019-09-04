const cluster = require('cluster');
const message = require('./const/message');

if (cluster.isMaster) {

    const { app, BrowserWindow } = require('electron');
    const path = require('path');
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

    function createCluster() {
        console.log(`Master ${process.pid} is running`);
        cluster.fork({ MAIN_WORKER: true });

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`);
        });

        cluster.on('fork', (worker) => {
            console.log(`Worker ${worker.process.pid} forked`);
            if (process.env.MAIN_WORKER_ID === undefined) {
                process.env.MAIN_WORKER_ID = worker.id;
            }
        });
    }

    app.on('ready', () => {
        createWindow();

        createCluster();
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

} else {
    if (process.env['MAIN_WORKER'] !== undefined) {
        const workers = require('./workers')
        workers.register();
    } else if (process.env['SERVER_FILE_PATH'] !== undefined) {

        require(process.env['SERVER_FILE_PATH']);

        process.on('uncaughtException', (error) => {
            process.send({ msg: message.SERVER_ERROR, error });
        });

        process.on('unhandledRejection', (error) => {
            process.send({ msg: message.SERVER_ERROR, error });
        });
    }
}
