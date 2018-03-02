var routeHome = require('./homeRoutes');
var routeLogin = require('./loginRoutes');
var routeAdmin = require('./adminRoutes');

module.exports = function(app){
    
    app.use('/admin', routeAdmin);
    app.use('/login', routeLogin);
    app.use('/', routeHome);
    

}