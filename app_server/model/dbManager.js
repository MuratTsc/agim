var subdomain = require('express-subdomain');
var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var v1Routes = express.Router();
var v2Routes = express.Router();


// module.exports = function(app){
    
    // app.use('/login', routeLogin);
    // app.use('/', routeHome);
    
    // router.get('/', function(req, res) {
    //   res.send('API - version 1');
    // });
    // v1Routes.get('/', function(req, res, next) {
    //   // res.send('API - version 2');
      
    //   var con = mysql.createConnection({
    //     host: "localhost",
    //     user: "root",
    //     password: "",
    //     database: "agimSubTest"
    //   });
    //   con.connect(function (err) {
    //     if (err) throw err;
    //   });
    //   module.exports = con;
    //   next();
    // });
    
    // router.use(subdomain('*.api', v1Routes));
      // v2Routes.get('/', function(req, res, next) {
        // res.send('API - version 2');
        
        // var con = mysql.createConnection({
        //   host: "localhost",
        //   user: "root",
        //   password: "",
        //   database: "agim"
        // });
        // con.connect(function (err) {
        //   if (err) throw err;
        // });
        // module.exports = con;
        
//         next();
//       });
//     router.use(subdomain('*.test', v2Routes));

// // }
// module.exports = router;


// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "agimSubTest"
// });

// con.connect(function (err) {
//   if (err) throw err;
// });

// module.exports = con;
