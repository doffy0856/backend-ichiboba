const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bodyparser = require('body-parser')

const app = express()
const port = 3000

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "test-db-ichi",
    port:"8889"
  });

  app.use(cors)


  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * from testxx", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
  



// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
//   })
