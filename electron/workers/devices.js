const path = require('path');
const find = require('local-devices');
const cp = require('child_process');
const message = require(path.join(__dirname, '../const/message'));

process.on('message', (inMsg) => {
    console.log(__filename, inMsg);
    const { msg, ...args } = inMsg;
    if (msg === message.GET_DEVICE_IP) {
        this.getDeviceIp(args);
    }
});

this.getDeviceIp = (args) => {
    try {
        const { mac } = args;

        this.findDeviceFromGateway(mac).then((ip) => {
            console.log("getDeviceIp-finished", args);
            process.send({ msg: message.GET_DEVICE_IP_FINISHED, ip, error: null });

        }).catch((error) => {
            this.findDeviceInSubnet(mac).then((ip) => {
                console.log("getDeviceIp-finished", args);
                process.send({ msg: message.GET_DEVICE_IP_FINISHED, ip, error: null });
            }).catch((error) => {
                console.error("getDeviceIp-finished", args, error);
                process.send({ msg: message.GET_DEVICE_IP_FINISHED, ip: null, error });
            });
        });
    } catch (error) {
        console.error("getDeviceIp-finished", args, error);
        process.send({ msg: message.GET_DEVICE_IP_FINISHED, error });
    }
};

this.findDeviceInSubnet = (mac) => {
    return new Promise((resolve, reject) => {
        find().then(devices => {
            devices.forEach((device) => {
                if (device.mac == mac) {
                    resolve(device.ip);
                }
            });
            reject();
        }).catch((error) => {
            reject(error);
        });
    });
};

this.findDeviceFromGateway = (mac) => {
    return new Promise((resolve, reject) => {
        cp.exec('arp -a', (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }

            if (process.platform.includes('linux')) {
                let rows = stdout.split('\n');
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    if (!(row === '' || row.indexOf('incomplete') >= 0)) {
                        var chunks = row.split(' ');
                        const ip = chunks[1].match(/\((.*)\)/)[1];
                        if (mac === chunks[3]) {
                            return resolve(ip);
                        }
                    }
                }
            } else if (process.platform.includes('win32')) {
                let rows = stdout.split('\n').splice(1);
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    let chunks = row.split(/\s+/g).filter((el) => {
                        return el.length > 1
                    });
                    const ip = chunks[0];
                    const mac = chunks[1].replace(/-/g, ':');
                    if (mac === chunks[3]) {
                        return resolve(ip);
                    }
                }
            }

            return reject();
        });
    });
};
