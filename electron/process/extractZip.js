const AdmZip = require('adm-zip');

let filePath = process.argv[2];
let targetPath = process.argv[3];

var zip = new AdmZip(filePath);
zip.extractAllTo(targetPath, true)
