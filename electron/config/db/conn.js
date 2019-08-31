const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

module.exports.getConn = function () {
  return db;
}

module.exports.closeConn = function() {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}
