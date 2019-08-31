const conn = require('./conn');

module.exports.createDb = function () {
    return new Promise((resolve, reject) => {
        conn.getConn().run(
            `CREATE TABLE IF NOT EXISTS key_value(
                Key text PRIMARY KEY,
                Value text
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

module.exports.set = function (key, value) {
    return new Promise((resolve, reject) => {
        conn.getConn().run(
            `INSERT INTO key_value(key,value) VALUES(?,?)`,
            [key, value],
            (result, err) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
    });
}

module.exports.get = function (key) {
    return new Promise((resolve, reject) => {
        conn.getConn().get(
            `SELECT Value value FROM key_value WHERE Key=?`,
            [key],
            (err, row) => {
                if (err) {
                    return reject(err);
                } else {
                    if (row != undefined || row != null) {
                        return resolve(row.value);
                    }
                    return resolve(null);
                }
            });
    });
}
