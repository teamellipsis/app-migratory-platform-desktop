const { ipcMain } = require('electron');
const keyValueDb = require('../config/db/key-value-db');
const devicesDb = require('../config/db/devices-db');
const Event = require('../../src/const/Event');

keyValueDb.createDb();
devicesDb.createDb();

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

ipcMain.on(Event.DEVICES_DB_CREATE, (event, { name, mac }) => {
    devicesDb.create(name, mac).then((value) => {
        event.returnValue = { value };
    }).catch(err => {
        event.returnValue = { err };
    });
});

ipcMain.on(Event.DEVICES_DB_READ, (event, { id }) => {
    devicesDb.read(id).then((value) => {
        event.returnValue = { value };
    }).catch(err => {
        event.returnValue = { err };
    });
});

ipcMain.on(Event.DEVICES_DB_READALL, (event) => {
    devicesDb.readAll().then((value) => {
        event.returnValue = { value };
    }).catch(err => {
        event.returnValue = { err };
    });
});

ipcMain.on(Event.DEVICES_DB_UPDATE, (event, { id, name, mac }) => {
    devicesDb.update(id, name, mac).then((value) => {
        event.returnValue = { value };
    }).catch(err => {
        event.returnValue = { err };
    });
});

ipcMain.on(Event.DEVICES_DB_DELETE, (event, { id }) => {
    devicesDb.delete(id).then((value) => {
        event.returnValue = { value };
    }).catch(err => {
        event.returnValue = { err };
    });
});
