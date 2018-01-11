var mysql = require('mysql');
var asd = require('./test');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "agim"
});

con.connect(function (err) {
  if (err) throw err;
});

module.exports = con;

asd(mysql, con);