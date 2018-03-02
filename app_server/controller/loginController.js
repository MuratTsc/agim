var con = require('../model/db');
var mysql = require('mysql');


module.exports.indexGet = function (req, res) {
    // res.render('login');
    // console.log("session.email --> " + req.session.email);
    //session kontrolü
    if (req.session.kurumId) {
        res.redirect('/');
    } else {
        if (req.subdomains.length > 0) { // subdomain varsa logine gidecek
            var sqlQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
            var inserts = ["kurumlar", "subdomain", req.subdomains[0], "isDeleted", false];
            sqlQuery = mysql.format(sqlQuery, inserts);
            con.query(sqlQuery, function (err, result, fields) {
                if (err) throw err;
                if (result[0]) {
                    res.render('login', { layout: 'login', logo: result[0].logo, mesaj: "" });
                } else {
                    res.render('login', { layout: 'login', logo: "no", mesaj: "<strong>Sistemde bu adrese kayıtlı bir kurum yok!</strong>"});
                }
            });
        } else { //subdomain yoksa 404 sayfası gösteriliyor
            res.redirect('/404');
        }
    }
}

module.exports.indexPost = function (req, res) {

    var gelenMail = req.body.email;
    var gelenSifre = req.body.password;

    var sqlQuery = "SELECT kullanici.id, kullanici.kullaniciAdi, kullanici.mail, kullanici.yetki, " +
    "kurumlar.id AS kurumId, kurumlar.subdomain, kurumlar.isDeleted AS isKurumDeleted FROM kullanici " +
    "LEFT JOIN kurumlar ON kullanici.kurumId = kurumlar.id " +
    "WHERE (?? = ? OR ?? = ? ) AND ?? = ? AND ?? = ? AND ((?? = ? AND ?? = ?) OR (?? = ?))";
    var inserts = ["kullaniciAdi", gelenMail, "kullanici.mail", gelenMail, "sifre", gelenSifre, 
    "kullanici.isDeleted", "0", "kurumlar.isDeleted", "0", "kurumlar.subdomain", req.subdomains[0],
    "kullanici.yetki", "0"];
    sqlQuery = mysql.format(sqlQuery, inserts);
    con.query(sqlQuery, function (err, result, fields) {
        if (err) throw err;
        //eşleşen kullanıcı varsa session oluşturuluyor
        if (result[0]) {
                req.session.kullaniciId = result[0].id;
                req.session.kullaniciAdi = result[0].kullaniciAdi;
                req.session.email = result[0].mail;
                req.session.yetki = result[0].yetki;
                req.session.kurumId = result[0].kurumId;
                req.session.subdomain = result[0].subdomain;
                //superAdmin giriş yapıyorsa
                if (result[0].yetki < 1) {
                    var sqlQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
                    var inserts = ["kurumlar", "subdomain", req.subdomains[0], "isDeleted", false];
                    sqlQuery = mysql.format(sqlQuery, inserts);
                    con.query(sqlQuery, function (err, result, fields) {
                        if (err) throw err;
                        if(result[0]){
                            req.session.kurumId = result[0].id;
                            req.session.subdomain = result[0].subdomain;
                            res.render('home', {
                                session: req.session
                            });
                        } else {
                            res.render('home', {
                                session: req.session
                            });
                        }
                    });
                } else { //kullanıcı giriş yapıyorsa
                    res.render('home', {
                        session: req.session
                    });
                }
            
        } else { //hatalı giriş
            if (req.body.logo) {
                res.render('login', { layout: 'login', logo: req.body.logo, mesaj: "errLogin"});
            } else {
                res.render('login', { layout: 'login', logo: "no", mesaj: "errLogin"});
            }
        }
    });
}

module.exports.logoutGet = function (req, res) {
    delete req.session.kullaniciId;
    delete req.session.kullaniciAdi;
    delete req.session.email;
    delete req.session.yetki;
    delete req.session.kurumId;
    delete req.session.subdomain;
    console.log('session silindi');
    res.redirect('/');
}
