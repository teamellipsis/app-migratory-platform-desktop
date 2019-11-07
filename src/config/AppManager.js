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

function sendAppInit(appName) {
    return new Promise((resolve, reject) => {
        ipcRenderer.once(Event.AM_SEND_APP_INIT_FINISH, (event, { error, server }) => {
            if (error) {
                reject();
            } else {
                resolve(server);
            }
        });

        ipcRenderer.send(Event.AM_SEND_APP_INIT, { appName });
    });
}

function sendAppEnd(appName) {
    return new Promise((resolve, reject) => {
        ipcRenderer.once(Event.AM_SEND_APP_END_FINISH, (event, { error }) => {
            if (error) {
                reject();
            } else {
                resolve();
            }
        });

        ipcRenderer.send(Event.AM_SEND_APP_END, { appName });
    });
}

function sendAppSendListen(appName) {
    return new Promise((resolve, reject) => {
        ipcRenderer.once(Event.AM_SEND_APP_SEND_FINISHED, (event, { error }) => {
            if (error) {
                reject();
            } else {
                resolve();
            }
        });

        ipcRenderer.send(Event.AM_SEND_APP_SEND_FINISH_LISTEN, { appName });
    });
}

function receiveApp(ipv4, port) {
    return new Promise((resolve, reject) => {
        ipcRenderer.once(Event.AM_RECEIVE_APP_FINISHED, (event, { error }) => {
            if (error) {
                reject();
            } else {
                resolve();
            }
        });

        ipcRenderer.send(Event.AM_RECEIVE_APP, { ipv4, port });
    });
}

function sendAppTrusted(appName, device) {
    return new Promise((resolve, reject) => {
        ipcRenderer.once(Event.AM_SEND_APP_TRUSTED_FINISHED, (event, { error }) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });

        ipcRenderer.send(Event.AM_SEND_APP_TRUSTED, { appName, device });
    });
}

export default {
    openApp,
    packageApp,
    sendAppInit,
    sendAppEnd,
    sendAppSendListen,
    receiveApp,
    sendAppTrusted,
};
