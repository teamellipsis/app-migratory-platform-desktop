import { ipcRenderer } from 'electron';
import * as Event from '../const/Event'

function set(key, value) {
    return ipcRenderer.sendSync(Event.KEY_VALUE_DB_SET, { key, value })
}

function get(key) {
    return ipcRenderer.sendSync(Event.KEY_VALUE_DB_GET, { key })
}

function addNewDevice(name, mac) {
    return ipcRenderer.sendSync(Event.DEVICES_DB_CREATE, { name, mac });
}

function getDeviceById(id) {
    return ipcRenderer.sendSync(Event.DEVICES_DB_READ, { id });
}

function getAllDevices() {
    return ipcRenderer.sendSync(Event.DEVICES_DB_READALL);
}

function updateDeviceById(id, name, mac) {
    return ipcRenderer.sendSync(Event.DEVICES_DB_UPDATE, { id, name, mac });
}

function deleteDeviceById(id) {
    return ipcRenderer.sendSync(Event.DEVICES_DB_DELETE, { id });
}

export default {
    set,
    get,
    addNewDevice,
    getDeviceById,
    getAllDevices,
    updateDeviceById,
    deleteDeviceById,
};
