const server = require('http').createServer((req, res) => {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
});
const io = require('socket.io')(server);
const AdmZip = require('adm-zip');
const path = require('path');
const keyValueDb = require(path.join(__dirname, 'db/key-value-db'));
const Key = require(path.join(__dirname, '../../src/const/Key'));
const Message = require(path.join(__dirname, '../const/message'));
const fs = require('fs');
const log = require(path.join(__dirname, 'log'));

const socketWorkerLogFile = fs.createWriteStream('./socket-worker.log', { flags: 'a' });
log.overrideLogging(socketWorkerLogFile);

console.log(process.argv);
const appName = process.argv[2];

keyValueDb.get(Key.APPS_DIR).then((appsDirPath) => {
    const srcDir = path.join(appsDirPath, appName)
    let zip = new AdmZip();
    zip.addLocalFolder(srcDir, appName);

    io.on('connection', socket => {
        socket.on('request', (args) => {
            socket.emit('send', zip.toBuffer(), () => {
                process.send({ msg: Message.SOCKET_SENT, appName });
            });
        });
    });

}).catch((error) => {
    throw error;
});

server.on('error', (error) => {
    process.send({ msg: Message.SOCKET_ERROR, error });
    throw error;
});

server.listen(0, (err) => {
    process.send({ msg: Message.SOCKET_LISTENING, server: server.address() });
    if (err) throw err;
    console.log(`Socket ready on http://localhost:${server.address().port}, pid:${process.pid}`);
});

process.on("message", (inMsg) => {
    const { msg } = inMsg;
    if (msg === Message.SOCKET_GET_ADDR) {
        process.send({ msg: Message.SOCKET_GET_ADDR, server: server.address() });
    }
});
