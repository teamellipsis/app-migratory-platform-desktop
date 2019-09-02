const { ipcMain } = require('electron');
const path = require('path');
const Event = require('../../src/const/Event');
const { execFile } = require('child_process');

ipcMain.on(Event.FM_GET_PROJECT_DIR, (event) => {
    event.returnValue = path.join(__dirname, '../../');
});

ipcMain.on(Event.FM_EXTRACT_ZIP, (event, { filePath, targetPath }) => {
    let extractZipFile = path.join(__dirname, '../process/extractZip.js');

    const child = execFile('node', [extractZipFile, filePath, targetPath], (error, stdout, stderr) => {
        event.sender.send(Event.FM_EXTRACT_ZIP_FINISH, { error, stdout, stderr })
    });
});
