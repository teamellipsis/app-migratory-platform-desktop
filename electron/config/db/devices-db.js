const conn = require('./conn');
const DEVICES = "devices";

module.exports.createDb = () => {
    return new Promise((resolve, reject) => {
        conn.getConn().run(
            `CREATE TABLE IF NOT EXISTS ${DEVICES}(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text NOT NULL,
                mac text NOT NULL UNIQUE
            )`,
            (result, err) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
    });
}

module.exports.create = (name, mac) => {
    return new Promise((resolve, reject) => {
        conn.getConn().run(
            `INSERT INTO ${DEVICES}(name,mac) VALUES(?,?)`,
            [name, mac],
            (result, err) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
    });
}

module.exports.read = (id) => {
    return new Promise((resolve, reject) => {
        conn.getConn().get(
            `SELECT name,mac FROM ${DEVICES} WHERE id=?`,
            [id],
            (err, row) => {
                if (err) {
                    return reject(err);
                } else {
                    if (row != undefined || row != null) {
                        return resolve(row);
                    }
                    return resolve(null);
                }
            });
    });
}

module.exports.readAll = () => {
    return new Promise((resolve, reject) => {
        conn.getConn().all(
            `SELECT * FROM ${DEVICES}`,
            (err, rows) => {
                if (err) {
                    return reject(err);
                } else {
                    if (rows != undefined || rows != null) {
                        return resolve(rows);
                    }
                    return resolve(null);
                }
            });
    });
}

module.exports.update = (id, name, mac) => {
    return new Promise((resolve, reject) => {
        conn.getConn().run(
            `UPDATE ${DEVICES} SET name=?,mac=? WHERE id=?`,
            [name, mac, id],
            (result, err) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
    });
}

module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        conn.getConn().run(
            `DELETE FROM ${DEVICES} WHERE id=?`,
            [id],
            (result, err) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
    });
}
