//database connectivity
const mysql = require('mysql');
let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'ecom_db'
  });

  module.exports = connection;