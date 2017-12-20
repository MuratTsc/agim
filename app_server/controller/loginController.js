var con = require('../model/db');
var testModel = require('../model/test');
var mysql = require('mysql');


module.exports.indexGet = function (req, res) {
    // res.render('login');
    console.log("session.email --> " + req.session.email);
    if (req.session.email) {
        console.log('daha önce giriş yapılmış anasayfaya gönderildi.');
        res.redirect('/');
    } else {
        console.log('giriş yapılmamış logine gönderildi');
        res.render('login', { layout: 'login' });
    }
}

module.exports.testGet = function (req, res, con) {
    // con.connect(function (err) {
    //     // if (err) throw err;
    //     con.query("SELECT * FROM user WHERE UserID = 2", function (err, result, fields) {
    //         if (err) throw err;
    //         console.log(result);
    //         console.log(result[0].UserName);
    //         //   console.log(fields);
    //         console.log(fields[0].name);
    //         console.log(fields[1].name);
    //         console.log(fields[2].name);
    //     });
    // });
    console.log('testGet');
    console.log(con); // dönen değer --> [Function: next]
    res.send('Test Sayfası');

    // con.query( 'SELECT * FROM wp_postmeta', function(err, testimonials) {
    //     return res.render('index', {data : testimonials});

    //   <% for (var i = 0; i < data.length; i++) { %>

    //      <li><% data[i].testimonial %></li>

    //   <% } %>
}
module.exports.indexPost = function (req, res) {




    // console.log(req.body);
    // var mail = "a@a.com";
    // var sifre = "1";

    // res.render('login', {
    //     username: req.body.email,
    //     password: req.body.pass
    // });
    // console.log("username: " + email + " pass: " + password);
    // console.log("username: " + req.body['email'] + " pass: " + req.body['password']);
    var gelenMail = req.body.email;
    var gelenSifre = req.body.password;
    var kullanici;

    var sqlQuery = "SELECT * FROM ?? WHERE (?? = ? OR ?? = ? ) AND ?? = ? AND ?? = ?";
    var inserts = ["kullanici", "kullaniciAdi", gelenMail, "mail", gelenMail, "sifre", gelenSifre, "isDeleted", "0"];
    sqlQuery = mysql.format(sqlQuery, inserts);
    con.query(sqlQuery, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        if (result[0]) {
            req.session.kullaniciAdi = result[0].kullaniciAdi;
            req.session.email = result[0].mail;
            req.session.yetki = result[0].yetki;
            res.render('home', { //user: result[0],
                                session: req.session }); //ejs sayfasına kullaniciliar adında değeri results olan nesne gönderir 
            // console.log('Giriş başarılı');
            // res.send("Giriş başarılı");
            // res.redirect('/');
        } else {
            console.log('Hatalı Giriş');
            res.send("Hatalı Giriş. " + '<a href="login">Giriş Yap</a>');
        }
    });
}

module.exports.logoutGet = function (req, res) {
    console.log('session silindi');
    delete req.session.kullaniciAdi;
    delete req.session.email;
    delete req.session.yetki;
    res.redirect('/');
}

// module.exports.signupGet = function (req, res) {
//     res.render('signup');
// }
// module.exports.signupPost = function (req, res) {

//     var yeniKullanici = new Kullanici({
//         ad: req.body.ad,
//         soyad: req.body.soyad,
//         email: req.body.email,
//         kullaniciAdi: req.body.kullaniciAdi,
//         sifre: req.body.sifre,
//     });

//     yeniKullanici.save(function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.redirect('/login/kullanicilarListesi');
//         }
//     });

//     // console.log(yeniKullanici);
//     // res.render('signup');
// }

// module.exports.kullanicilarListesi = function (req, res) {

//     Kullanici.find(function (err, results) {
//         // console.log(results);
//         res.render('kullanicilarListesi', { kullanicilar: results }); //ejs sayfasına kullaniciliar adında değeri results olan nesne gönderir 
//     });

// }

// module.exports.kullaniciSil = function (req, res) {
//     Kullanici.findOneAndRemove({ kullaniciAdi: req.params.kullaniciAdi }, function (err) {
//         if (err) {
//             console.log('LoginController.js: Silme hatası');
//         } else {
//             res.redirect('/login/kullanicilarListesi');
//         }
//     })
// }
// module.exports.kullaniciDuzenleGet = function (req, res) {
//     res.render('kullaniciDuzenle');
//     // console.log(req.params.kullanici);
//     // Kullanici.findOne({ kullaniciAdi: req.params.kullanici }, function (err, results) {
//     //     console.log(results);
//     //     res.render('kullaniciDuzenle', { kullanici: results }); //ejs sayfasına kullaniciliar adında değeri results olan nesne gönderir 
//     // });
// }
// module.exports.kullaniciDuzenlePost = function (req, res) {
//     // var gelenKullanici = new Kullanici({
//     //     ad: req.body.ad,
//     //     soyad: req.body.soyad,
//     //     email: req.body.email,
//     //     kullaniciAdi: req.body.kullaniciAdi,
//     //     sifre: req.body.sifre,
//     // });
//     Kullanici.findOneAndUpdate({ kullaniciAdi: req.params.kullaniciAdi }, {
//         ad: req.body.ad,
//         soyad: req.body.soyad,
//         email: req.body.email,
//         kullaniciAdi: req.body.kullaniciAdi,
//         sifre: req.body.sifre,
//     }, { new: true }, function (err, task) {
//         if (err) {
//             res.send(err);
//         } else {
//             // res.redirect('/login/kullanicilarListesi');
//             // res.json(task);
//             console.log(task);
//         }
//     });

//     // Kullanici.findOneAndUpdate({ kullaniciAdi: req.params.kullaniciAdi },
//     //     {$set: {ad: req.body.ad,
//     //         soyad: req.body.soyad,
//     //         email: req.body.email,
//     //         kullaniciAdi: req.body.kullaniciAdi,
//     //         sifre: req.body.sifre}},
//     //         {upsert: true},
//     //     function (err) {
//     //     if (err) {
//     //         console.log('LoginController.js: Düzenleme hatası');
//     //     } else {
//     //         res.redirect('/login/kullanicilarListesi');
//     //     }

//     // })
//     console.log('Düzenle');
//     // res.render('kullaniciDuzenle');
// }