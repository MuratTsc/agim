var routeHome = require('./homeRoutes');
var routeLogin = require('./loginRoutes');
// var routeApi = require('../model/dbManager');


module.exports = function(app){
    
    // app.use('/', routeApi);
    app.use('/login', routeLogin);
    app.use('/', routeHome);
    

}