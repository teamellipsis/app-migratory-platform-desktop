import { ipcRenderer } from 'electron';
import * as Event from '../const/Event'

function openApp(appPath) {
    return new Promise((resolve, reject) => {
        ipcRenderer.once(Event.AM_OPEN_APP_FINISH, (event, { error }) => {
            if (error) {
                reject()
            } else {
                resolve()
            }
        });

        ipcRenderer.send(Event.AM_OPEN_APP, { appPath });
    });
}

function packageApp(appName) {
    return new Promise((resolve, reject) => {
        ipcRenderer.once(Event.AM_PACKAGE_APP_FINISH, (event, { error }) => {
            if (error) {
                reject()
            } else {
                resolve()
            }
        });

        ipcRenderer.send(Event.AM_PACKAGE_APP, { appName });
    });
}

export default { openApp, packageApp };
