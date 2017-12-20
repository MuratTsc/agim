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

// con.connect(function(err, connection) {
//     // if (err) throw err;
//     console.log("app.js içinde bağlandı");
//     var sql = "SELECT * FROM user WHERE UserID = 2";
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("Result: " + result);
//     });
//   });

//   con.connect(function(err) {
//     // if (err) throw err;
//     con.query("SELECT * FROM user WHERE UserID = 2", function (err, result, fields) {
//       if (err) throw err;
//       console.log(result);
//       console.log(result[0].UserName);
//     //   console.log(fields);
//       console.log(fields[0].name);
//       console.log(fields[1].name);
//       console.log(fields[2].name);
//     });
//   });


// var addComment = function(user,comment,mysql,pool,callback) {
//     var self = this;
//     pool.getConnection(function(err,connection){
//         if (err) {
//             connection.release();
//             return callback(true,null);
//         } else {
//             var sqlQuery = "INSERT into ?? (??,??,??) VALUES ((SELECT ?? FROM ?? WHERE ?? = ?),?,?)";
//             var inserts =["UserComment","UserId","UserName",
//                                      "Comment","UserId","User","UserName",
//                                       user,user,comment];
//             sqlQuery = mysql.format(sqlQuery,inserts);
//             connection.query(sqlQuery,function(err,rows){
//                 connection.release();
//                 if (err) {
//                     return callback(true,null);
//                 } else {
//                     callback(false,"comment added");
//                 }
//             });
//         }
//         connection.on('error', function(err) {
//             return callback(true,null);
//         });
//     });
// };

// module.exports.addComment = addComment;