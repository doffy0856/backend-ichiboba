const mysql = require('mysql')

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb",
    port:"8889" 
  });

    db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!")
  });

  
module.exports = db