const { ipcMain } = require('electron');
const keyValueDb = require('../config/db/key-value-db');
const Event = require('../../src/const/Event');

keyValueDb.createDb()

ipcMain.on(Event.KEY_VALUE_DB_SET, (event, { key, value }) => {
    keyValueDb.set(key, value).then(() => {
        event.returnValue = { key, value }
    }).catch(err => {
        event.returnValue = { err }
    });
});

ipcMain.on(Event.KEY_VALUE_DB_GET, (event, { key }) => {
    keyValueDb.get(key).then((value) => {
        event.returnValue = { key, value }
    }).catch(err => {
        event.returnValue = { err }
    });
});
