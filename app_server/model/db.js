var mysql = require('mysql');
var asd = require('./test');

var con = mysql.createConnection({
  host: "sql11.freemysqlhosting.net",
  user: "sql11219604",
  password: "FvNWyQpVbs",
  database: "sql11219604"
});

con.connect(function (err) {
  if (err) throw err;
});

module.exports = con;

asd(mysql, con);
