var routeHome = require('./homeRoutes');
var routeLogin = require('./loginRoutes');

// var sess;

//buradaki app fonksiyonun çağırıldığı yerdeki express nesnesi
module.exports = function(app){
    
    app.use('/login', routeLogin);
    app.use('/', routeHome);
    
    // app.get('/',function(req,res){
    //     Console.log('ana dizine get çalıştı');
    //     sess=req.session;
    //     Console.log('ana dizine get session ataması temem');
    //     /*
    //     * Here we have assign the 'session' to 'sess'.
    //     * Now we can create any number of session variable we want.
    //     * in PHP we do as $_SESSION['var name'].
    //     * Here we do like this.
    //     */
    //     sess.email; // equivalent to $_SESSION['email'] in PHP.
    //     sess.username; // equivalent to $_SESSION['username'] in PHP.
    //     Console.log('ana dizine get session değişkenleri tanımlandı. email ve username');
    // });

}