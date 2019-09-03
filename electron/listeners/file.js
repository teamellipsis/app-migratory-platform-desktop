const { ipcMain } = require('electron');
const path = require('path');
const Event = require('../../src/const/Event');
const cluster = require('cluster');
const message = require('../const/message');

ipcMain.on(Event.FM_GET_PROJECT_DIR, (event) => {
    event.returnValue = path.join(__dirname, '../../');
});

ipcMain.on(Event.FM_EXTRACT_ZIP, (event, { filePath, targetPath }) => {
    let mainWorkerId = process.env.MAIN_WORKER_ID;
    if (mainWorkerId !== undefined) {
        cluster.workers[mainWorkerId].send({ msg: message.EXECUTE, func: 'extractZip', filePath, targetPath });

        cluster.workers[mainWorkerId].on('message', (msg) => {
            if (msg.msg === message.EXTRACT_FINISHED) {
                event.sender.send(Event.FM_EXTRACT_ZIP_FINISH, { error: msg.error })
            }
        });
    } else {
        event.sender.send(Event.FM_EXTRACT_ZIP_FINISH, { error: "Worker process failed" })
    }
});
