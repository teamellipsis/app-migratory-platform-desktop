import { ipcRenderer } from 'electron';
import * as Event from '../const/Event'

function set(key, value) {
    return ipcRenderer.sendSync(Event.KEY_VALUE_DB_SET, { key, value })
}

function get(key) {
    return ipcRenderer.sendSync(Event.KEY_VALUE_DB_GET, { key })
}

export default { set, get };
