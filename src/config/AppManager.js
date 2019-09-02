import { ipcRenderer } from 'electron';
import * as Event from '../const/Event'

function openApp(appPath) {
    console.log(appPath);
    return new Promise((resolve, reject) => {
        ipcRenderer.once(Event.AM_OPEN_APP_FINISH, (event, { error, stdout, stderr }) => {
            if (error) {
                reject()
            } else {
                resolve()
            }
        });

        ipcRenderer.send(Event.AM_OPEN_APP, { appPath });
    });
}

export default { openApp };
