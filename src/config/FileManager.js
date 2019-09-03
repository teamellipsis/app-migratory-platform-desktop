import { ipcRenderer } from 'electron';
import * as Event from '../const/Event'

function getProjectDir() {
    return ipcRenderer.sendSync(Event.FM_GET_PROJECT_DIR)
}

function extractZip(filePath, targetPath) {
    return new Promise((resolve, reject) => {
        ipcRenderer.once(Event.FM_EXTRACT_ZIP_FINISH, (event, { error }) => {
            if (error) {
                reject()
            } else {
                resolve()
            }
        });

        ipcRenderer.send(Event.FM_EXTRACT_ZIP, { filePath, targetPath });
    });
}

export default { getProjectDir, extractZip };
