import { ipcRenderer } from 'electron';

function set(key, value) {
    return ipcRenderer.sendSync('set_key-value-db', { key, value })
}

function get(key) {
    return ipcRenderer.sendSync('get_key-value-db', { key })
}

export default { set, get };
