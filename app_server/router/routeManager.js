var routeHome = require('./homeRoutes');
var routeLogin = require('./loginRoutes');


module.exports = function(app){
    
    app.use('/login', routeLogin);
    app.use('/', routeHome);
    

}