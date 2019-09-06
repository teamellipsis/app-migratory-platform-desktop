const { ipcMain } = require('electron');
const path = require('path');
const Event = require('../../src/const/Event');
const message = require('../const/message');

ipcMain.on(Event.FM_GET_PROJECT_DIR, (event) => {
    event.returnValue = path.join(__dirname, '../../');
});

ipcMain.on(Event.FM_EXTRACT_ZIP, (event, { filePath, targetPath }) => {
    const mainWorker = require('../workers/mainWorker').get();
    if (mainWorker !== null) {
        mainWorker.send({ msg: message.EXECUTE, func: 'extractZip', filePath, targetPath });

        mainWorker.on('message', (msg) => {
            if (msg.msg === message.EXTRACT_FINISHED) {
                event.sender.send(Event.FM_EXTRACT_ZIP_FINISH, { error: msg.error })
            }
        });
    } else {
        event.sender.send(Event.FM_EXTRACT_ZIP_FINISH, { error: "Worker process failed" })
    }
});
