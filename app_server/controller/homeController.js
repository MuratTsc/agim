var con = require('../model/db');
var mysql = require('mysql');

module.exports.index = function (req, res) {
    if (req.session.email) {
        // res.render('home');


        con.query("SELECT * FROM seviye", function (err, result, fields) {
            if (err) throw err;
            // console.log(result);
            // console.log(result[0].ogrenim_seviyesi);
            // //   console.log(fields);
            // console.log(fields[0].name);
            // console.log(fields[1].name);
            // console.log(fields[2].name);
            // res.render('home', { kullanicilar: result }); //ejs sayfasına kullaniciliar adında değeri results olan nesne gönderir 
        });

        res.render('home', { session: req.session });

    } else {
        res.render('login', { layout: 'login' });
    }
}

module.exports.flot = function (req, res) {
    res.render('flot');
}

module.exports.tables = function (req, res) {
    res.render('tables');
}

//kullanıcı işlemleri
module.exports.kullanicilar = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        con.query("SELECT * FROM kullanici WHERE isDeleted = false", function (err, result, fields) {
            if (err) throw err;
            res.render('kullanicilar', { mesaj: 'no', kullanicilar: result, session: req.session });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.kullaniciDuzenle = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var gelenId = req.params.kullaniciId;
        console.log('gelen id: ' + gelenId);
        var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
        var inserts = ["kullanici", "id", gelenId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) throw err;
            if (result[0]) {
                res.render('kullaniciDuzenle', { mesaj: 'no', kullanici: result[0], session: req.session });
            } else {
                res.render('hata', { mesaj: '' });
                // res.render('hata', { mesaj: 'Kullanıcı düzenleme hatası. Kullanıcı bilgileri alınamadı!' });
            }
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.kullaniciDuzenlePost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        console.log(req.body);

        var gelenKullaniciId = req.body.kullaniciId;
        var gelenKullaniciAdi = req.body.kullaniciAdi;
        var gelenMail = req.body.email;
        var gelenYetki = req.body.yetki;

        console.log('post ile gelenler: ' + gelenKullaniciId + gelenKullaniciAdi + gelenMail + gelenYetki);

        var sqlQuery = "UPDATE kullanici SET kullaniciAdi = ?, mail = ?, yetki = ? WHERE id = ?";
        var inserts = [gelenKullaniciAdi, gelenMail, gelenYetki, gelenKullaniciId];
        // var sqlQuery = "UPDATE ?? SET ?? = ? AND ?? = ? AND ?? = ? WHERE ?? = ?";
        // var inserts = ["kullanici", "kullaniciAdi", gelenKullaniciAdi,
        //     "mail", gelenMail, "yetki", gelenYetki, "id", gelenKullaniciId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('kullaniciDuzenle', {
                    mesaj: 'err',
                    kullanici: {},
                    session: req.session
                });
                throw err
            } else {
                res.render('kullaniciDuzenle', {
                    mesaj: 'ok',
                    kullanici: {
                        kullaniciId: gelenKullaniciId,
                        kullaniciAdi: gelenKullaniciAdi,
                        mail: gelenMail,
                        yetki: gelenYetki
                    },
                    session: req.session
                });
            };
            // if (result[0]) {
            // } else {
            // }
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.kullaniciEkleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        res.render('kullaniciEkle', { mesaj: '', session: req.session });
    } else {
        res.redirect('/403');
    }
}

module.exports.kullaniciSil = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        console.log('kullaniciSil çalıştı. id= ' + req.body.kullaniciId + "/" + req.params.kullaniciId);

        // var sqlQuery = "DELETE FROM ?? WHERE ?? = ?";
        var sqlQuery = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var inserts = ["kullanici", "isDeleted", true, "id", req.body.kullaniciId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.send('err');
                throw err
            } else {
                res.send('ok');
            };
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.kullaniciEklePost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        console.log(req.body);

        var sqlQuery = "INSERT INTO kullanici (kullaniciAdi, sifre, mail, yetki) VALUES (?, ?, ?, ?)";
        var inserts = [req.body.kullaniciAdi, req.body.sifre, req.body.email, req.body.yetki];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('kullaniciEkle', {
                    mesaj: 'err',
                    session: req.session
                });
                throw err
            } else {
                res.render('kullaniciEkle', {
                    mesaj: 'ok',
                    session: req.session
                });
            };
        });

    } else {
        res.redirect('/403');
    }
}

//akademik kurul
module.exports.akademikKurul = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        con.query("SELECT * FROM akademikRapor", function (err, result, fields) {
            if (err) throw err;
            console.log(result[0].raporTarih.getDate() + "." + (result[0].raporTarih.getMonth() + 1) + "." + result[0].raporTarih.getFullYear());
            // akdRaporlar[i].raporTarih.toISOString().replace(/T.+/, '') //"T" ve sonrasının yerine boşluk ('') yaz
            res.render('akademikKurul', { akdRaporlar: result, session: req.session });
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.akademikRaporDuzenle = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var year = new Date().toISOString().replace(/\-.+/, '');

        var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
        var inserts = ["akademikRapor", "id", req.params.raporId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('akademikRaporDuzenle', {
                    year,
                    mesaj: 'err',
                    akademikRapor: result[0],
                    session: req.session
                });
                throw err
            } else {
                var akademikRaporResult = result[0];
                akademikRaporResult.raporTarih = result[0].raporTarih.getFullYear() + "-" + (result[0].raporTarih.getMonth() + 1) + "-" + result[0].raporTarih.getDate();
                res.render('akademikRaporDuzenle', {
                    year,
                    mesaj: 'no',
                    akademikRapor: akademikRaporResult,
                    session: req.session
                });
            };
        });

    } else { // if (req.session.email && req.session.yetki < 2)
        res.redirect('/403');
    }
}

module.exports.akademikRaporDuzenlePost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var year = new Date().toISOString().replace(/\-.+/, '');

        var sqlQuery = "UPDATE akademikrapor SET ?? = ?, ?? = ?, ?? = ?, " +
            "?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE id = ?";
        var inserts = [
            "donem", req.body.donem, "raporNo", req.body.raporNo,
            "raporTarih", req.body.raporTarih, "ukyTeknikler", req.body.ukyTeknikler,
            "ogrMateryali", req.body.ogrMateryali, "hazirlananSorular", req.body.hazirlananSorular,
            "agis", req.body.agis, "digerEtkinlikler", req.body.digerEtkinlikler,
            "zumreBaskani", req.body.zumreBaskani, "akademikDanisman", req.body.akademikDanisman,
            req.body.raporId
        ];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('akademikRaporDuzenle', {
                    year,
                    mesaj: 'err',
                    akademikRapor: {
                        id: '',
                        donem: '',
                        raporNo: '',
                        raporTarih: '',
                        ukyTeknikler: '',
                        ogrMateryali: '',
                        hazirlananSorular: '',
                        agis: '',
                        digerEtkinlikler: '',
                        zumreBaskani: '',
                        akademikDanisman: ''
                        // isDeleted: ''
                    },
                    session: req.session
                });
                throw err
            } else {
                res.render('akademikRaporDuzenle', {
                    year,
                    mesaj: 'ok',
                    akademikRapor: {
                        id: req.body.id,
                        donem: req.body.donem,
                        raporNo: req.body.raporNo,
                        raporTarih: req.body.raporTarih,
                        ukyTeknikler: req.body.ukyTeknikler,
                        ogrMateryali: req.body.ogrMateryali,
                        hazirlananSorular: req.body.hazirlananSorular,
                        agis: req.body.agis,
                        digerEtkinlikler: req.body.digerEtkinlikler,
                        zumreBaskani: req.body.zumreBaskani,
                        akademikDanisman: req.body.akademikDanisman
                        // isDeleted: req.body.isDeleted
                    },
                    session: req.session
                });
            };
        });

    } else { // if(req.session.email && req.session.yetki < 2)
        res.redirect('/403');
    }
}

//materyal bankası
module.exports.materyalListesi = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {
        con.query("SELECT * FROM materyal LEFT JOIN kullanici ON materyal.kullanici = kullanici.id WHERE materyal.isDeleted = false", function (err, result, fields) {
            if (err) {
                res.render('materyalListesi', { mesaj: 'Materyaller listelenemedi!', materyal: result, session: req.session });
                throw err;
            } else {
                console.log(result[0]);
                res.render('materyalListesi', { mesaj: 'no', materyal: result, session: req.session });
            }
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.materyalDuzenle = function (req, res) {
}

module.exports.materyalDuzenlePost = function (req, res) {
}

module.exports.materyal = function (req, res) {
}

//hata sayfaları
module.exports.yasak = function (req, res) {
    res.render('403', { layout: '403' });
}
module.exports.sayfaYok = function (req, res) {
    res.render('404', { layout: '404' });
}
module.exports.hata = function (req, res) {
    // res.render('hata', { layout: 'hata' });
    res.render('hata', { mesaj: '' });
}