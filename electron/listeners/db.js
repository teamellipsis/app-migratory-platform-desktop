const { ipcMain } = require('electron');
const keyValueDb = require('../config/db/key-value-db')

keyValueDb.createDb()

ipcMain.on('set_key-value-db', (event, { key, value }) => {
    keyValueDb.set(key, value).then(() => {
        event.returnValue = { key, value }
    }).catch(err => {
        event.returnValue = { err }
    });
});

ipcMain.on('get_key-value-db', (event, { key }) => {
    keyValueDb.get(key).then((value) => {
        event.returnValue = { key, value }
    }).catch(err => {
        event.returnValue = { err }
    });
});
