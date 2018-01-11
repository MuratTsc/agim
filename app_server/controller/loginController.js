var con = require('../model/db');
var testModel = require('../model/test');
var mysql = require('mysql');


module.exports.indexGet = function (req, res) {
    // res.render('login');
    // console.log("session.email --> " + req.session.email);
    if (req.session.email) {
        console.log('daha önce giriş yapılmış anasayfaya gönderildi.');
        res.redirect('/');
    } else {
        console.log('giriş yapılmamış logine gönderildi');
        res.render('login', { layout: 'login' });
    }
}

module.exports.indexPost = function (req, res) {

    var gelenMail = req.body.email;
    var gelenSifre = req.body.password;
    var kullanici;

    var sqlQuery = "SELECT * FROM ?? WHERE (?? = ? OR ?? = ? ) AND ?? = ? AND ?? = ?";
    var inserts = ["kullanici", "kullaniciAdi", gelenMail, "mail", gelenMail, "sifre", gelenSifre, "isDeleted", "0"];
    sqlQuery = mysql.format(sqlQuery, inserts);
    con.query(sqlQuery, function (err, result, fields) {
        if (err) throw err;

        if (result[0]) {
            req.session.kullaniciId = result[0].id;
            req.session.kullaniciAdi = result[0].kullaniciAdi;
            req.session.email = result[0].mail;
            req.session.yetki = result[0].yetki;
            res.render('home', {
                session: req.session
            });
            
        } else {
            res.send("Hatalı Giriş. " + '<a href="login">Giriş Yap</a>');
        }
    });
}

module.exports.logoutGet = function (req, res) {
    delete req.session.kullaniciId;
    delete req.session.kullaniciAdi;
    delete req.session.email;
    delete req.session.yetki;
    console.log('session silindi');
    res.redirect('/');
}
