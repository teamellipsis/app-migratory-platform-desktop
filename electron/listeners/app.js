const { ipcMain } = require('electron');
const path = require('path');
const Event = require('../../src/const/Event');
const Key = require('../../src/const/Key');
const { BrowserWindow } = require('electron');
const message = require('../const/message');
const keyValueDb = require('../config/db/key-value-db');
const childProcess = require('child_process');
const socketWorkers = require('../workers/socketWorkers')

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

ipcMain.on(Event.AM_PACKAGE_APP, (event, { appName }) => {
    let mainWorker = require('../workers/mainWorker').get();
    if (mainWorker !== null) {
        keyValueDb.get(Key.APPS_DIR).then((appsDirPath) => {
            keyValueDb.get(Key.PACKAGES_DIR).then((packagesDirPath) => {
                mainWorker.send({
                    msg: message.EXECUTE,
                    func: 'packageDir',
                    srcDir: path.join(appsDirPath, appName),
                    targetDir: packagesDirPath,
                    appName: appName,
                });

                mainWorker.on('message', (msg) => {
                    if (msg.msg === message.PACKAGE_FINISHED) {
                        event.sender.send(Event.AM_PACKAGE_APP_FINISH, { error: msg.error });
                    }
                });
            }).catch((error) => {
                event.sender.send(Event.AM_PACKAGE_APP_FINISH, { error });
            });
        }).catch((error) => {
            event.sender.send(Event.AM_PACKAGE_APP_FINISH, { error });
        });
    } else {
        event.sender.send(Event.AM_PACKAGE_APP_FINISH, { error: "Worker process failed" })
    }
});

ipcMain.on(Event.AM_SEND_APP_INIT, (event, { appName }) => {
    if (socketWorkers.exists(appName)) {
        const worker = socketWorkers.get(appName);
        worker.once('message', (inMsg) => {
            const { msg } = inMsg;
            if (msg === message.SOCKET_GET_ADDR) {
                const { server } = inMsg;
                event.sender.send(Event.AM_SEND_APP_INIT_FINISH, { error: null, server });
            }
        });
        worker.send({ msg: message.SOCKET_GET_ADDR });
    } else {

        const socketServerFilePath = path.join(__dirname, '../config/app-send-socket.js');
        const worker = childProcess.fork(socketServerFilePath, [appName]);
        socketWorkers.add(appName, worker);

        // Only listen for first `error` or `listening` message
        worker.once('message', (inMsg) => {
            const { msg } = inMsg;
            if (msg === message.SOCKET_ERROR) {
                const { error } = inMsg;
                event.sender.send(Event.AM_SEND_APP_INIT_FINISH, { error });

            } else if (msg === message.SOCKET_LISTENING) {
                const { server } = inMsg;
                console.log(`Socket listening on port:${server.port}`);
                event.sender.send(Event.AM_SEND_APP_INIT_FINISH, { error: null, server });
            }
        });

        worker.on('exit', (code, signal) => {
            console.log(`Worker(Socket) ${worker.pid} exit with code:${code}, signal:${signal}`);
        });
    }
});

ipcMain.on(Event.AM_SEND_APP_END, (event, { appName }) => {
    const worker = socketWorkers.get(appName);

    if (worker !== undefined && !worker.killed) {
        worker.kill('SIGTERM');
        socketWorkers.delete(appName);

        event.sender.send(Event.AM_SEND_APP_END_FINISH, { error: null });
    } else {
        event.sender.send(Event.AM_SEND_APP_END_FINISH, { error: "Worker already killed" });
    }
});

ipcMain.on(Event.AM_SEND_APP_SEND_FINISH_LISTEN, (event, { appName }) => {
    const worker = socketWorkers.get(appName);

    worker.once('message', (inMsg) => {
        const { msg } = inMsg;
        if (msg === message.SOCKET_SENT) {
            const { appName } = inMsg;
            event.sender.send(Event.AM_SEND_APP_SEND_FINISHED, { error: null, appName });
        }
    });
});

ipcMain.on(Event.AM_RECEIVE_APP, (event, { ipv4, port }) => {
    let mainWorker = require('../workers/mainWorker').get();
    if (mainWorker !== null) {
        keyValueDb.get(Key.APPS_DIR).then((appsDirPath) => {
            mainWorker.send({
                msg: message.RECEIVE_APP_INIT,
                appsDirPath,
                ipv4,
                port,
            });

            mainWorker.on('message', (msg) => {
                if (msg.msg === message.RECEIVE_APP_FINISHED) {
                    event.sender.send(Event.AM_RECEIVE_APP_FINISHED, { error: msg.error });
                }
            });
        }).catch((error) => {
            event.sender.send(Event.AM_RECEIVE_APP_FINISHED, { error });
        });
    } else {
        event.sender.send(Event.AM_RECEIVE_APP_FINISHED, { error: "Worker process failed" })
    }
});
