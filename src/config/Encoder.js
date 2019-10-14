const ip = require('ip');
const BASE_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@?';

module.exports.encodeIpv4 = (ipv4, port) => {
    if (!ip.isV4Format(ipv4)) {
        return false;
    }

    let binaryStr = ''
    ipv4.split('.').forEach((str) => {
        let ipPart = parseInt(str, 10).toString(2);
        let prefix = ipPart.length % 8 === 0 ? 0 : 8 - ipPart.length
        binaryStr += '0'.repeat(prefix) + ipPart
    });

    let binaryPort = parseInt(port, 10).toString(2);
    let prefix = binaryPort.length % 16 === 0 ? 0 : 16 - binaryPort.length;
    binaryStr += '0'.repeat(prefix) + binaryPort;

    let encodedStr = '';
    for (let i = 0; i < binaryStr.length; i += 6) {
        let splitedBinaryStr = binaryStr.substring(i, i + 6);
        let character = BASE_CHARS.charAt(parseInt(splitedBinaryStr, 2))
        encodedStr += character;
    }

    return encodedStr;
};

module.exports.decodeIpv4 = (encodedString) => {
    let decodeStr = '';
    for (let i = 0; i < encodedString.length; i++) {
        let character = BASE_CHARS.indexOf(encodedString.charAt(i));
        if (character === -1) return false;
        let binaryStr = character.toString(2);
        let prefix = binaryStr.length % 6 === 0 ? 0 : 6 - binaryStr.length;
        decodeStr += '0'.repeat(prefix) + binaryStr;
    }

    let decodeStrIp = decodeStr.substring(0, 32);  // 255.255.255.255 => 4bytes => 8bits x 4
    let decodeStrPort = decodeStr.substring(32, 48); // 65535 => 2bytes => 16bits

    let ipv4 = [];
    for (let i = 0; i < decodeStrIp.length; i += 8) {
        let splitedBinaryStr = decodeStrIp.substring(i, i + 8);
        ipv4.push(parseInt(splitedBinaryStr, 2));
    }

    return { ipv4: ipv4.join('.'), port: parseInt(decodeStrPort, 2) };
};
