var con = require('../model/db');
var mysql = require('mysql');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var util = require('util');

module.exports.index = function (req, res) {
    if (req.session.email) {
        con.query("SELECT * FROM seviye", function (err, result, fields) {
            if (err) throw err;
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
        // console.log('gelen id: ' + gelenId);
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

        // console.log(req.body);

        var gelenKullaniciId = req.body.kullaniciId;
        var gelenKullaniciAdi = req.body.kullaniciAdi;
        var gelenMail = req.body.email;
        var gelenYetki = req.body.yetki;

        // console.log('post ile gelenler: ' + gelenKullaniciId + gelenKullaniciAdi + gelenMail + gelenYetki);

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
        // console.log('kullaniciSil çalıştı. id= ' + req.body.kullaniciId + "/" + req.params.kullaniciId);

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

        // console.log(req.body);

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

        con.query("SELECT * FROM akademikRapor WHERE isDeleted = FALSE", function (err, result, fields) {
            if (err) throw err;
            // console.log(result[0].raporTarih.getDate() + "." + (result[0].raporTarih.getMonth() + 1) + "." + result[0].raporTarih.getFullYear());
            // akdRaporlar[i].raporTarih.toISOString().replace(/T.+/, '') //"T" ve sonrasının yerine boşluk ('') yaz
            res.render('akademikKurul', { mesaj: "no", akdRaporlar: result, session: req.session });
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

        var sqlQuery = "UPDATE akademikrapor SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE id = ?";
        var inserts = [
            "donem", req.body.donem, "raporNo", req.body.raporNo,
            "raporTarih", req.body.raporTarih, "raporIcerik", req.body.raporIcerik,
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
                        raporIcerik: '',
                        zumreBaskani: '',
                        akademikDanisman: ''
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
                        raporIcerik: req.body.raporIcerik,
                        zumreBaskani: req.body.zumreBaskani,
                        akademikDanisman: req.body.akademikDanisman
                    },
                    session: req.session
                });
            };
        });

    } else { // if(req.session.email && req.session.yetki < 2)
        res.redirect('/403');
    }
}

module.exports.akademikRaporEkleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        var year = new Date().toISOString().replace(/\-.+/, '');
        res.render('akademikRaporEkle', {
            year,
            mesaj: 'no',
            akademikRapor: {
                donem: '',
                raporNo: '',
                raporTarih: '',
                raporIcerik: '',
                zumreBaskani: '',
                akademikDanisman: ''
            },
            session: req.session
        });
    }
}

module.exports.akademikRaporEklePost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var year = new Date().toISOString().replace(/\T.+/, '');

        var sqlQuery = "INSERT INTO akademikrapor (??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?)";
        var inserts = [
            "donem", "raporNo", "raporTarih",
            "raporIcerik", "zumreBaskani", "akademikDanisman",
            "kullanici",
            req.body.donem, req.body.raporNo, req.body.raporTarih,
            req.body.raporIcerik, req.body.zumreBaskani, req.body.akademikDanisman,
            req.session.kullaniciId
        ];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('akademikRaporEkle', {
                    year,
                    mesaj: 'err',
                    akademikRapor: {
                        donem: '',
                        raporNo: '',
                        raporTarih: '',
                        raporIcerik: '',
                        zumreBaskani: '',
                        akademikDanisman: ''
                    },
                    session: req.session
                });
                throw err
            } else {
                res.render('akademikRaporEkle', {
                    year,
                    mesaj: 'ok',
                    akademikRapor: {
                        donem: req.body.donem,
                        raporNo: req.body.raporNo,
                        raporTarih: req.body.raporTarih,
                        raporIcerik: req.body.raporIcerik,
                        zumreBaskani: req.body.zumreBaskani,
                        akademikDanisman: req.body.akademikDanisman
                    },
                    session: req.session
                });
            };
        });

    } else { // if(req.session.email && req.session.yetki < 2)
        res.redirect('/403');
    }
}

module.exports.akademikRaporSilPost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var sqlQuery = "UPDATE akademikrapor SET ?? = ? WHERE id = ?";
        var inserts = [ "isDeleted", true, req.body.akdRaporId ];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) throw err;
            
            // var raporTarihi = result[0].raporTarih.getDate() + "." + (result[0].raporTarih.getMonth() + 1) + "." + result[0].raporTarih.getFullYear();
            // var akdRpr = result[0];
            con.query("SELECT * FROM akademikRapor WHERE isDeleted = FALSE", function (err, result, fields) {
                if (err) throw err;

                res.render('akademikKurul', {
                    // mesaj: akdRpr.raporNo + 'nolu, ' + raporTarihi + 'tarihli rapor silindi!',
                    mesaj: 'Rapor silindi!',
                    akdRaporlar: result, session: req.session
                });
            });

        });

    } else { // if(req.session.email && req.session.yetki < 2)
        res.redirect('/403');
    }
}

//Parametre İşlemleri
    //<<ders
module.exports.dersListesi = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        // con.query("SELECT ders.id AS id, dersAdi, sinif_id, sinif.sinifi AS sinifi " + 
        // "FROM ders " + 
        // "LEFT JOIN sinif ON ders.sinif_id = sinif.id " + 
        // "WHERE ders.isDeleted = false", function (err, result, fields) {
        //     if (err) {
        //         // res.render('dersListesi', { mesaj: 'no', dersler: result, session: req.session });
        //         throw err;
        //     } else {
        //         res.render('dersListesi', { mesaj: 'no', dersler: result, session: req.session });
        //     }
        // });
        con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
            if (err) throw err;
            // res.render('dersListesi', { mesaj: 'no', dersler: result, session: req.session });
            res.render('dersListesi', { mesaj: 'no', sinif: result, secilen: 0, dersler: {
                id: "",
                dersAdi: "",
                sinif_id: "",
                sinifi: ""
            }, session: req.session });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.sinifaGoreDersListesiPost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        con.query("SELECT ders.id AS id, dersAdi, sinif_id, sinif.sinifi AS sinifi " + 
        "FROM ders " + 
        "LEFT JOIN sinif ON ders.sinif_id = sinif.id " + 
        "WHERE ders.sinif_id = " + req.body.sinif + " AND ders.isDeleted = false", function (err, result, fields) {
            var dersler = result;
            if (err) throw err;
            con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                if (err) throw err;
                res.render('dersListesi', { mesaj: 'no', sinif: result, secilen: req.body.sinif, dersler: dersler, session: req.session });
                // res.render('dersListesi', { mesaj: 'no', dersler: dersler, session: req.session });
            });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.dersEkleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {
        con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
            if (err) throw err;
            res.render('dersEkle', { mesaj: 'no', sinif: result, session: req.session });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.dersEklePost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var sqlQuery = "INSERT INTO ders (dersAdi, sinif_id) VALUES (?, ?)";
        var inserts = [req.body.dersAdi, req.body.sinif];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('dersEkle', {
                    mesaj: 'err',
                    sinif: req.body.sinif,
                    session: req.session
                });
                throw err
            } else {
                con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    res.render('dersEkle', { mesaj: 'ok', sinif: result, session: req.session });
                });
            };
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.dersDuzenleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
        var inserts = ["ders", "id", req.params.dersId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) throw err;
            if (result[0]) {
                var ders = result[0];
                con.query("SELECT * FROM sinif WHERE isDeleted = FALSE", function (err, result, fields) {
                    if (err) throw err;
                    res.render('dersDuzenle', { mesaj: 'no', ders: ders, sinif: result, session: req.session });
                });
            } else {
                res.render('hata', { mesaj: 'no' });
            }
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.dersDuzenlePost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var sqlQuery = "UPDATE ders SET ?? = ?, ?? = ? WHERE id = ?";
        var inserts = [
            "dersAdi", req.body.dersAdi, "sinif_id", req.body.sinif,
            req.body.dersId
        ];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('dersDuzenle', {
                    mesaj: 'err',
                    sinif: req.body.sinif,
                    ders:{
                        id: req.body.dersId,
                        dersAdi: req.body.dersAdi,
                        sinif_id: req.body.sinif
                    },
                    session: req.session
                });
                throw err
            } else {
                con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    res.render('dersDuzenle', { mesaj: 'ok', sinif: result,
                    ders:{
                        id: req.body.dersId,
                        dersAdi: req.body.dersAdi,
                        sinif_id: req.body.sinif
                    },
                    session: req.session });
                });
            };
        });

    } else {
        res.redirect('/403');
    }
}
    //ders>>

    //<<ünite
module.exports.uniteListesi = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
            if (err) throw err;
            var sinif = result;
            con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                if (err) throw err;
                res.render('uniteListesi', { mesaj: 'no', unite: {
                    uniteAdi: "",
                    uniteNo: "",
                    sinifi: "",
                    dersAdi: ""
                }, sinif: sinif, ders: result, secilen: 0, session: req.session });
            });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.derseGoreUniteListesiPost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        con.query("SELECT unite.id AS id, unite.uniteAdi, unite.uniteNo, unite.sinif_id, unite.ders_id, sinif.sinifi AS sinifi, ders.dersAdi AS dersAdi " + 
        "FROM unite " + 
        "LEFT JOIN ders ON unite.ders_id = ders.id " + 
        "LEFT JOIN sinif ON unite.sinif_id = sinif.id " + 
        "WHERE unite.ders_id = " + req.body.ders + " AND unite.isDeleted = false", function (err, result, fields) {
            var unite = result;
            if (err) throw err;
            con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                if (err) throw err;
                var sinif = result;
                con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    res.render('uniteListesi', { mesaj: 'no', unite: unite, sinif: sinif, ders: result, secilen: req.body.ders, session: req.session });
                });
            });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.uniteEkleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
            if (err) throw err;
            var sinif = result;
            con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                if (err) throw err;
                res.render('uniteEkle', { mesaj: 'no', sinif: sinif, ders: result, session: req.session });
            });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.uniteEklePost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var uniteAdi = req.body.uniteAdi;
        var uniteNo = req.body.uniteNo;
        var sinifId = req.body.sinif;
        var dersId = req.body.ders;
        var sqlQuery = "INSERT INTO unite (uniteAdi, uniteNo, sinif_id, ders_id) VALUES (?, ?, ?, ?)";
        var inserts = [uniteAdi, uniteNo, sinifId, dersId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('uniteEkle', {
                    mesaj: 'err',
                    unite: {
                        uniteAdi: uniteAdi,
                        uniteNo: uniteNo
                    },
                    sinif: sinifId,
                    ders: dersId,
                    session: req.session
                });
                // throw err
            } else {
                con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    var sinif = result;
                    con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                        if (err) throw err;
                        res.render('uniteEkle', {
                            mesaj: 'ok',
                            unite: {
                                uniteAdi: uniteAdi,
                                uniteNo: uniteNo
                            },
                            sinif: sinif,
                            ders: result,
                            session: req.session
                        });
                    });
                });
            };
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.uniteDuzenleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
        var inserts = ["unite", "id", req.params.uniteId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) throw err;
            if (result[0]) {
                var unite = result[0];
                con.query("SELECT * FROM sinif WHERE isDeleted = FALSE", function (err, result, fields) {
                    if (err) throw err;
                    var sinif = result;
                    con.query("SELECT * FROM ders WHERE isDeleted = FALSE", function (err, result, fields) {
                        if (err) throw err;
                        res.render('uniteDuzenle', { mesaj: 'no', ders: result, sinif: sinif, unite: unite, session: req.session });
                    });
                });
            } else {
                res.render('hata', { mesaj: 'no' });
            }
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.uniteDuzenlePost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var sqlQuery = "UPDATE unite SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE id = ?";
        var inserts = [
            "uniteAdi", req.body.uniteAdi, "uniteNo", req.body.uniteNo,
            "sinif_id", req.body.sinif, "ders_id", req.body.ders,
            req.body.uniteId
        ];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('uniteDuzenle', {
                    mesaj: 'err',
                    sinif: req.body.sinif,
                    ders: req.body.ders,
                    unite:{
                        id: req.body.uniteId,
                        uniteAdi: req.body.uniteAdi,
                        uniteNo: req.body.uniteNo,
                        sinif_id: req.body.sinif,
                        ders_id: req.body.ders
                    },
                    session: req.session
                });
                throw err
            } else {
                con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    var sinif = result;
                    con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                        if (err) throw err;
                        res.render('uniteDuzenle', { mesaj: 'ok',
                        sinif: sinif,
                        ders: result,
                        unite:{
                            id: req.body.uniteId,
                            uniteAdi: req.body.uniteAdi,
                            uniteNo: req.body.uniteNo,
                            sinif_id: req.body.sinif,
                            ders_id: req.body.ders
                        },
                        session: req.session });
                    });
                });
            };
        });

    } else {
        res.redirect('/403');
    }
}
    //ünite>>

    //<<konu
module.exports.konuListesi = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
            if (err) throw err;
            var sinif = result;
            con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                if (err) throw err;
                var ders = result;
                con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    res.render('konuListesi', { mesaj: 'no', konu: {
                        konuAdi: "",
                        konuNo: "",
                        sinifi: "",
                        dersAdi: "",
                        uniteAdi: ""
                    },
                    sinif: sinif, ders: ders, unite: result, secilen: 0, session: req.session });
                });
            });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.uniteyeGoreKonuListesiPost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        con.query("SELECT konu.id AS id, konu.konuAdi, konu.konuNo, konu.sinif_id, konu.ders_id , konu.unite_id, " + 
        "sinif.sinifi AS sinifi, ders.dersAdi AS dersAdi, unite.uniteAdi AS uniteAdi " + 
        "FROM konu " + 
        "LEFT JOIN sinif ON konu.sinif_id = sinif.id " + 
        "LEFT JOIN ders ON konu.ders_id = ders.id " + 
        "LEFT JOIN unite ON konu.unite_id = unite.id " + 
        "WHERE konu.unite_id = " + req.body.unite + " AND konu.isDeleted = false", function (err, result, fields) {
            var konu = result;
            console.log(konu);
            if (err) throw err;
            con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                if (err) throw err;
                var sinif = result;
                con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    var ders = result;
                    con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                        if (err) throw err;
                        res.render('konuListesi', { mesaj: 'no', sinif: sinif, ders: ders, unite: result, konu: konu, secilen: req.body.unite, session: req.session });
                    });
                });
            });
        });
    } else {
        res.redirect('/403');
    }    
}

module.exports.konuEkleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
            if (err) throw err;
            var sinif = result;
            con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                if (err) throw err;
                var ders = result;
                con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    res.render('konuEkle', { mesaj: 'no', sinif: sinif, ders: ders, unite: result, session: req.session });
                });
            });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.konuEklePost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var konuAdi = req.body.konuAdi;
        var konuNo = req.body.konuNo;
        var sinifId = req.body.sinif;
        var dersId = req.body.ders;
        var uniteId = req.body.unite;
        var sqlQuery = "INSERT INTO konu (konuAdi, konuNo, sinif_id, ders_id, unite_id) VALUES (?, ?, ?, ?, ?)";
        var inserts = [konuAdi, konuNo, sinifId, dersId, uniteId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('konuEkle', {
                    mesaj: 'err',
                    konu: {
                        konuAdi: konuAdi,
                        konuNo: konuNo
                        // sinifId: sinifId,
                        // dersId: dersId,
                        // uniteId: uniteId
                    },
                    sinif: sinifId,
                    ders: dersId,
                    unite: uniteId,
                    session: req.session
                });
                // throw err
            } else {
                con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    var sinif = result;
                    con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                        if (err) throw err;
                        var ders = result;
                        con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                            if (err) throw err;
                            res.render('konuEkle', {
                                mesaj: 'ok',
                                konu: {
                                    konuAdi: konuAdi,
                                    konuNo: konuNo
                                },
                                sinif: sinif,
                                ders: ders,
                                unite: result,
                                session: req.session
                            });
                        });
                    });
                });
            };
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.konuDuzenleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
        var inserts = ["konu", "id", req.params.konuId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) throw err;
            if (result[0]) {
                var konu = result[0];
                con.query("SELECT * FROM sinif WHERE isDeleted = FALSE", function (err, result, fields) {
                    if (err) throw err;
                    var sinif = result;
                    con.query("SELECT * FROM ders WHERE isDeleted = FALSE", function (err, result, fields) {
                        if (err) throw err;
                        var ders = result;
                        con.query("SELECT * FROM unite WHERE isDeleted = FALSE", function (err, result, fields) {
                            if (err) throw err;
                            res.render('konuDuzenle', { mesaj: 'no',sinif: sinif, ders: ders, unite: result, konu: konu, session: req.session });
                        });
                    });
                });
            } else {
                res.render('hata', { mesaj: 'no', session: req.session });
            }
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.konuDuzenlePost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var sqlQuery = "UPDATE konu SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE id = ?";
        var inserts = [
            "konuAdi", req.body.konuAdi, "konuNo", req.body.konuNo,
            "sinif_id", req.body.sinif, "ders_id", req.body.ders,
            "unite_id", req.body.unite, req.body.konuId
        ];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('konuDuzenle', {
                    mesaj: 'err',
                    sinif: req.body.sinif,
                    ders: req.body.ders,
                    unite: req.body.unite,
                    konu:{
                        id: req.body.konuId,
                        konuAdi: req.body.konuAdi,
                        konuNo: req.body.konuNo,
                        sinif_id: req.body.sinif,
                        ders_id: req.body.ders,
                        unite_id: req.body.unite
                    },
                    session: req.session
                });
                throw err
            } else {
                con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    var sinif = result;
                    con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                        if (err) throw err;
                        var ders = result;
                        con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                            if (err) throw err;
                            res.render('konuDuzenle', { mesaj: 'ok',
                            sinif: sinif,
                            ders: ders,
                            unite: result,
                            konu: {
                                id: req.body.konuId,
                                konuAdi: req.body.konuAdi,
                                konuNo: req.body.konuNo,
                                sinif_id: req.body.sinif,
                                ders_id: req.body.ders,
                                unite_id: req.body.unite
                            },
                            session: req.session });
                        });
                    });
                });
            };
        });

    } else {
        res.redirect('/403');
    }
}

    //konu>>

    //<<kazanim
module.exports.kazanimListesi = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
            if (err) throw err;
            var sinif = result;
            con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                if (err) throw err;
                var ders = result;
                con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    var unite = result;
                    con.query("SELECT * FROM konu WHERE isDeleted = false", function (err, result, fields) {
                        if (err) throw err;
                        res.render('kazanimListesi', { mesaj: 'no', kazanim: {
                            kazanimAdi: "",
                            kazanimNo: "",
                            sinifi: "",
                            dersAdi: "",
                            uniteAdi: "",
                            konuAdi: ""
                        },
                        sinif: sinif, ders: ders, unite: unite, konu: result, secilen: 0, session: req.session });
                    });
                });
            });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.konuyaGoreKazanimListesiPost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        con.query("SELECT kazanim.id AS id, kazanim.kazanimAdi, kazanim.kazanimNo, kazanim.sinif_id, kazanim.ders_id , kazanim.unite_id, " + 
        "sinif.sinifi AS sinifi, ders.dersAdi AS dersAdi, unite.uniteAdi AS uniteAdi, konu.konuAdi AS konuAdi " + 
        "FROM kazanim " + 
        "LEFT JOIN sinif ON kazanim.sinif_id = sinif.id " + 
        "LEFT JOIN ders ON kazanim.ders_id = ders.id " + 
        "LEFT JOIN unite ON kazanim.unite_id = unite.id " + 
        "LEFT JOIN konu ON kazanim.konu_id = konu.id " + 
        "WHERE kazanim.konu_id = " + req.body.konu + " AND kazanim.isDeleted = false", function (err, result, fields) {
            var kazanim = result;
            if (err) throw err;
            con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                if (err) throw err;
                var sinif = result;
                con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    var ders = result;
                    con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                        if (err) throw err;
                        var unite = result;
                        con.query("SELECT * FROM konu WHERE isDeleted = false", function (err, result, fields) {
                            if (err) throw err;
                            res.render('kazanimListesi', { mesaj: 'no', sinif: sinif, ders: ders, unite: unite, konu: result,
                            kazanim: kazanim, secilen: req.body.konu, session: req.session });
                        });
                    });
                });
            });
        });
    } else {
        res.redirect('/403');
    }    
}

module.exports.kazanimEkleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {
        con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
            if (err) throw err;
            var sinif = result;
            con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                if (err) throw err;
                var ders = result;
                con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    var unite = result;
                    con.query("SELECT * FROM konu WHERE isDeleted = false", function (err, result, fields) {
                        if (err) throw err;
                        res.render('kazanimEkle', { mesaj: 'no', sinif: sinif, ders: ders, unite: unite, konu: result, session: req.session });
                    });
                });
            });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.kazanimEklePost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var kazanimAdi = req.body.kazanimAdi;
        var kazanimNo = req.body.kazanimNo;
        var sinifId = req.body.sinif;
        var dersId = req.body.ders;
        var uniteId = req.body.unite;
        var konuId = req.body.konu;
        var sqlQuery = "INSERT INTO kazanim (kazanimAdi, kazanimNo, sinif_id, ders_id, unite_id, konu_id) VALUES (?, ?, ?, ?, ?, ?)";
        var inserts = [kazanimAdi, kazanimNo, sinifId, dersId, uniteId, konuId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('kazanimEkle', {
                    mesaj: 'err',
                    kazanim: {
                        kazanimAdi: kazanimAdi,
                        kazanimNo: kazanimNo
                    },
                    sinif: sinifId,
                    ders: dersId,
                    unite: uniteId,
                    konu: konuId,
                    session: req.session
                });
                // throw err
            } else {
                con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    var sinif = result;
                    con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                        if (err) throw err;
                        var ders = result;
                        con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                            if (err) throw err;
                            var unite = result;
                            con.query("SELECT * FROM konu WHERE isDeleted = false", function (err, result, fields) {
                                if (err) throw err;
                                res.render('kazanimEkle', {
                                    mesaj: 'ok',
                                    kazanim: {
                                        kazanimAdi: kazanimAdi,
                                        kazanimNo: kazanimNo
                                    },
                                    sinif: sinif,
                                    ders: ders,
                                    unite: unite,
                                    konu: result,
                                    session: req.session
                                });
                            });
                        });
                    });
                });
            };
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.kazanimDuzenleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
        var inserts = ["kazanim", "id", req.params.kazanimId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) throw err;
            if (result[0]) {
                var kazanim = result[0];
                con.query("SELECT * FROM sinif WHERE isDeleted = FALSE", function (err, result, fields) {
                    if (err) throw err;
                    var sinif = result;
                    con.query("SELECT * FROM ders WHERE isDeleted = FALSE", function (err, result, fields) {
                        if (err) throw err;
                        var ders = result;
                        con.query("SELECT * FROM unite WHERE isDeleted = FALSE", function (err, result, fields) {
                            if (err) throw err;
                            var unite = result;
                            con.query("SELECT * FROM konu WHERE isDeleted = FALSE", function (err, result, fields) {
                                if (err) throw err;
                                res.render('kazanimDuzenle', { mesaj: 'no',sinif: sinif, ders: ders, unite: unite, konu: result, kazanim: kazanim, session: req.session });
                            });
                        });
                    });
                });
            } else {
                res.render('hata', { mesaj: 'no', session: req.session });
            }
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.kazanimDuzenlePost = function (req, res) {
    if (req.session.email && req.session.yetki < 2) {

        var sqlQuery = "UPDATE kazanim SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE id = ?";
        var inserts = [
            "kazanimAdi", req.body.kazanimAdi, "kazanimNo", req.body.kazanimNo,
            "sinif_id", req.body.sinif, "ders_id", req.body.ders,
            "unite_id", req.body.unite, "konu_id", req.body.konu,
             req.body.kazanimId
        ];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('kazanimDuzenle', {
                    mesaj: 'err',
                    sinif: req.body.sinif,
                    ders: req.body.ders,
                    unite: req.body.unite,
                    konu: req.body.konu,
                    kazanim:{
                        id: req.body.kazanimId,
                        kazanimAdi: req.body.kazanimAdi,
                        kazanimNo: req.body.kazanimNo,
                        sinif_id: req.body.sinif,
                        ders_id: req.body.ders,
                        unite_id: req.body.unite,
                        konu_id: req.body.konu
                    },
                    session: req.session
                });
                throw err
            } else {
                con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                    if (err) throw err;
                    var sinif = result;
                    con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                        if (err) throw err;
                        var ders = result;
                        con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                            if (err) throw err;
                            var unite = result;
                            con.query("SELECT * FROM konu WHERE isDeleted = false", function (err, result, fields) {
                                if (err) throw err;
                                res.render('kazanimDuzenle', { mesaj: 'ok',
                                sinif: sinif,
                                ders: ders,
                                unite: unite,
                                konu: result,
                                kazanim: {
                                    id: req.body.kazanimId,
                                    kazanimAdi: req.body.kazanimAdi,
                                    kazanimNo: req.body.kazanimNo,
                                    sinif_id: req.body.sinif,
                                    ders_id: req.body.ders,
                                    unite_id: req.body.unite,
                                    konu_id: req.body.konu
                                },
                                session: req.session });
                            });
                        });
                    });
                });
            };
        });

    } else {
        res.redirect('/403');
    }
}
    //kazanim>>

//materyal bankası
module.exports.materyalListesi = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {
        con.query("SELECT materyal.id AS id, materyalAdi, dosyaYolu, dosyaTuru, tarih, kazanim, " +
        "kullanici.id AS kullanici, kullanici.kullaniciAdi AS kullaniciAdi FROM materyal " + 
        "LEFT JOIN kullanici ON materyal.kullanici = kullanici.id WHERE materyal.isDeleted = false", function (err, result, fields) {
            if (err) {
                res.render('materyalListesi', { mesaj: 'Materyaller listelenemedi!', materyal: result, session: req.session });
                throw err;
            } else {
                // console.log(result[0]);
                res.render('materyalListesi', { mesaj: 'no', materyal: result, session: req.session });
            }
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.materyalEkleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {
        var seviye, sinif, ders, unite, konu, kazanim;
        con.query("SELECT * FROM seviye WHERE isDeleted = false", function (err, result, fields) {
            if (err) { throw err; } else { seviye = result; }
            con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                if (err) { throw err; } else { sinif = result; }
                con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                    if (err) { throw err; } else { ders = result; }
                    con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                        if (err) { throw err; } else { unite = result; }
                        con.query("SELECT * FROM konu WHERE isDeleted = false", function (err, result, fields) {
                            if (err) { throw err; } else { konu = result; }
                            con.query("SELECT * FROM kazanim WHERE isDeleted = false", function (err, result, fields) {
                                if (err) { throw err; } else { kazanim = result; }
                                res.render('materyalEkle', { mesaj: 'no', seviye: seviye, sinif: sinif, ders: ders, unite: unite, 
                                konu: konu, kazanim: kazanim, session: req.session });
                            });
                        });
                    });
                });
            });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.materyalEklePost = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {

    var form = new formidable.IncomingForm();
    
        form.on('fileBegin', function (name, file){
            file.path = './uploads/' + Date.now() + "_" + file.name;
        });
        
        form.on('file', function (name, file){
            // fs.rename(file.path, path.join(form.uploadDir, file.name));
            // console.log('Uploaded ' + file.name);
        });
    
        form.parse(req, function(err, fields, files) {
            if (err) next(err);

            var materyalAdi = fields.materyalAdi;
            var dosyaYolu = files.upload.path;
            var dosyaTuru = files.upload.type;
            var tarih = files.upload.lastModifiedDate;
            var seviye = fields.seviye;
            var sinif = fields.sinif;
            var ders = fields.ders;
            var unite = fields.unite;
            var konu = fields.konu;
            var kazanim = fields.kazanim;
            var kullanici = fields.kullaniciId;

            var sqlQuery = "INSERT INTO materyal (materyalAdi, dosyaYolu, dosyaTuru, tarih, seviye, sinif, ders, unite, konu, kazanim, kullanici) " + 
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var inserts = [materyalAdi, dosyaYolu, dosyaTuru, tarih, seviye, sinif, ders,
                unite, konu, kazanim, kullanici];
            sqlQuery = mysql.format(sqlQuery, inserts);
            con.query(sqlQuery, function (err, result, fields) {
                if (err) {
                    res.render('materyalEkle', {
                        mesaj: 'err',
                        materyalAdi: "",
                        seviye: {id: "", ogrenim_seviyesi: ""},
                        sinif: {id: "", sinifi: ""},
                        ders: {id: "", dersAdi: ""},
                        unite: {id: "", uniteAdi: ""},
                        konu: {id: "", konuAdi: ""},
                        kazanim: {id: "", kazanimAdi: ""},
                        session: req.session
                    });
                    throw err
                } else {
                    if (true) {
                        var seviye, sinif, ders, unite, konu, kazanim;
                        con.query("SELECT * FROM seviye WHERE isDeleted = false", function (err, result, fields) {
                            if (err) { throw err; } else { seviye = result; }
                            con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                                if (err) { throw err; } else { sinif = result; }
                                con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                                    if (err) { throw err; } else { ders = result; }
                                    con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                                        if (err) { throw err; } else { unite = result; }
                                        con.query("SELECT * FROM konu WHERE isDeleted = false", function (err, result, fields) {
                                            if (err) { throw err; } else { konu = result; }
                                            con.query("SELECT * FROM kazanim WHERE isDeleted = false", function (err, result, fields) {
                                                if (err) { throw err; } else { kazanim = result; }
                                                res.render('materyalEkle', { mesaj: 'ok', seviye: seviye, sinif: sinif, ders: ders, unite: unite, 
                                                konu: konu, kazanim: kazanim, session: req.session });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    } else {
                        res.render('materyalEkle', {
                            mesaj: 'err',
                            materyalAdi: "",
                            seviye: {id: "", ogrenim_seviyesi: ""},
                            sinif: {id: "", sinifi: ""},
                            ders: {id: "", dersAdi: ""},
                            unite: {id: "", uniteAdi: ""},
                            konu: {id: "", konuAdi: ""},
                            kazanim: {id: "", kazanimAdi: ""},
                            session: req.session
                        });
                    }
                };
            });

        });

    } else {
        res.redirect('/403');
    }
}

module.exports.materyalDuzenleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {

        var materyal;
        var gelenId = req.params.materyalId;
        // console.log('gelen id: ' + gelenId);
        var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
        var inserts = ["materyal", "id", gelenId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) { throw err } else if (result[0]) {
                materyal = result[0];
            
            var seviye, sinif, ders, unite, konu, kazanim;
            con.query("SELECT * FROM seviye WHERE isDeleted = false", function (err, result, fields) {
                if (err) { throw err; } else { seviye = result; }
                con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                    if (err) { throw err; } else { sinif = result; }
                    con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                        if (err) { throw err; } else { ders = result; }
                        con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                            if (err) { throw err; } else { unite = result; }
                            con.query("SELECT * FROM konu WHERE isDeleted = false", function (err, result, fields) {
                                if (err) { throw err; } else { konu = result; }
                                con.query("SELECT * FROM kazanim WHERE isDeleted = false", function (err, result, fields) {
                                    if (err) { throw err; } else { kazanim = result; }
                                    res.render('materyalDuzenle', { mesaj: 'no', materyal: materyal, seviye: seviye, sinif: sinif, ders: ders, unite: unite, 
                                    konu: konu, kazanim: kazanim, session: req.session });
                                });
                            });
                        });
                    });
                });
            });
                // res.render('materyalDuzenle', { mesaj: 'no', kullanici: result[0], session: req.session });
            } else {
                res.render('hata', { mesaj: '' });
                // res.render('hata', { mesaj: 'Kullanıcı düzenleme hatası. Kullanıcı bilgileri alınamadı!' });
            }
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.materyalDuzenlePost = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {

        var sqlQuery = "UPDATE materyal SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var inserts = ["materyalAdi", req.body.materyalAdi, "seviye", req.body.seviye,
        "sinif", req.body.sinif, "ders", req.body.ders, "unite", req.body.unite,
        "konu", req.body.konu, "kazanim", req.body.kazanim, "id", req.body.materyalId];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) throw err;
            var materyal;
            var seviye, sinif, ders, unite, konu, kazanim;
            con.query("SELECT * FROM materyal WHERE id = " + req.body.materyalId, function (err, result, fields) {
                materyal = result[0];
                con.query("SELECT * FROM seviye WHERE isDeleted = false", function (err, result, fields) {
                    if (err) { throw err; } else { seviye = result; }
                    con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                        if (err) { throw err; } else { sinif = result; }
                        con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                            if (err) { throw err; } else { ders = result; }
                            con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                                if (err) { throw err; } else { unite = result; }
                                con.query("SELECT * FROM konu WHERE isDeleted = false", function (err, result, fields) {
                                    if (err) { throw err; } else { konu = result; }
                                    con.query("SELECT * FROM kazanim WHERE isDeleted = false", function (err, result, fields) {
                                        if (err) { throw err; } else { kazanim = result; }
                                        res.render('materyalDuzenle', { mesaj: 'ok', materyal: materyal, seviye: seviye, sinif: sinif, ders: ders, unite: unite, 
                                        konu: konu, kazanim: kazanim, session: req.session });
                                    });
                                });
                            });
                        });
                    });
                });
            });
            
        });

    } else {
        res.redirect('/403');
    }
}

module.exports.materyal = function (req, res) {
}

//rehberlik
module.exports.rehberlikRaporListesi = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {
        con.query("SELECT * FROM rehberlik " + 
        "LEFT JOIN seviye ON rehberlik.seviye = seviye.id " + 
        "LEFT JOIN sinif ON rehberlik.sinif = sinif.id " + 
        "LEFT JOIN ders ON rehberlik.ders = ders.id " + 
        "LEFT JOIN kullanici ON rehberlik.kullanici = kullanici.id " + 
        "WHERE rehberlik.isDeleted = false LIMIT 50", function (err, result, fields) {
            if (err) {
                res.render('rehberlikRaporListesi', { mesaj: 'Rehberlik Raporları listelenemedi!', rehberlik: result, session: req.session });
                throw err;
            } else {
                res.render('rehberlikRaporListesi', { mesaj: 'no', rehberlik: result, session: req.session });
            }
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.rehberlikRaporEkleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {
        var seviye, sinif, ders;
        con.query("SELECT * FROM seviye WHERE isDeleted = false", function (err, result, fields) {
            if (err) { throw err; } else { seviye = result; }
            con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                if (err) { throw err; } else { sinif = result; }
                con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                    if (err) { throw err; } else { ders = result; }
                    res.render('rehberlikRaporuEkle', { mesaj: 'no', seviye: seviye, sinif: sinif, ders: ders, session: req.session });
                });
            });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.rehberlikRaporEklePost = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {

        var rapor = req.body.rapor;
        var tarih = new Date().toISOString().replace(/\T.+/, '');
        var seviye = req.body.seviye;
        var sinif = req.body.sinif;
        var ders = req.body.ders;
        var kullanici = req.session.kullaniciId;

        var sqlQuery = "INSERT INTO rehberlik (rapor, tarih, seviye, sinif, ders, kullanici) " + 
        "VALUES (?, ?, ?, ?, ?, ?)";
        var inserts = [rapor, tarih, seviye, sinif, ders, kullanici];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('rehberlikRaporuEkle', {
                    mesaj: 'err',
                    seviye: seviye, sinif: sinif, ders: ders, session: req.session
                });
                throw err
            } else {
                var seviye, sinif, ders;
                con.query("SELECT * FROM seviye WHERE isDeleted = false", function (err, result, fields) {
                    if (err) { throw err; } else { seviye = result; }
                    con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                        if (err) { throw err; } else { sinif = result; }
                        con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                            if (err) { throw err; } else { ders = result; }
                            res.render('rehberlikRaporuEkle', { mesaj: 'ok', seviye: seviye, sinif: sinif, ders: ders, session: req.session });
                        });
                    });
                });
            };
        });

    } else {
        res.redirect('/403');
    }
}

//soru bankası
module.exports.soruListesi = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {
        con.query("SELECT * " + //"sorular.id AS id, sinif.sinifi AS sinifi, ders.dersAdi AS dersAdi " + 
        //"materyalAdi, dosyaYolu, dosyaTuru, tarih, kazanim, " +
        //"kullanici.id AS kullanici, kullanici.kullaniciAdi AS kullaniciAdi " + 
        "FROM sorular " + 
        "LEFT JOIN sinif ON sorular.sinif = sinif.id " + 
        "LEFT JOIN ders ON sorular.ders = ders.id " + 
        "LEFT JOIN unite ON sorular.unite = unite.id " + 
        "LEFT JOIN konu ON sorular.konu = konu.id " + 
        "LEFT JOIN kazanim ON sorular.kazanim = kazanim.id " + 
        "LEFT JOIN kullanici ON sorular.kullanici = kullanici.id " + 
        "WHERE sorular.isDeleted = false", function (err, result, fields) {
            if (err) {
                res.render('soruListesi', { mesaj: 'Sorular listelenemedi!', sorular: result, session: req.session });
                throw err;
            } else {
                // console.log(result[0]);
                res.render('soruListesi', { mesaj: 'no', sorular: result, session: req.session });
            }
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.soruEkleGet = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {
        var seviye, sinif, ders, unite, konu, kazanim;
        con.query("SELECT * FROM seviye WHERE isDeleted = false", function (err, result, fields) {
            if (err) { throw err; } else { seviye = result; }
            con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                if (err) { throw err; } else { sinif = result; }
                con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                    if (err) { throw err; } else { ders = result; }
                    con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                        if (err) { throw err; } else { unite = result; }
                        con.query("SELECT * FROM konu WHERE isDeleted = false", function (err, result, fields) {
                            if (err) { throw err; } else { konu = result; }
                            con.query("SELECT * FROM kazanim WHERE isDeleted = false", function (err, result, fields) {
                                if (err) { throw err; } else { kazanim = result; }
                                res.render('soruEkle', { mesaj: 'no', seviye: seviye, sinif: sinif, ders: ders, unite: unite, 
                                konu: konu, kazanim: kazanim, session: req.session });
                            });
                        });
                    });
                });
            });
        });
    } else {
        res.redirect('/403');
    }
}

module.exports.soruEklePost = function (req, res) {
    if (req.session.email && req.session.yetki < 3) {

        var soru = req.body.soru;
        var cevap = req.body.cevap;
        var zorluk = req.body.zorluk;
        var tarih = new Date().toISOString().replace(/\T.+/, '');
        var seviye = req.body.seviye;
        var sinif = req.body.sinif;
        var ders = req.body.ders;
        var unite = req.body.unite;
        var konu = req.body.konu;
        var kazanim = req.body.kazanim;
        var kullanici = req.session.kullaniciId;

        var sqlQuery = "INSERT INTO sorular (soru, cevap, zorluk, tarih, seviye, sinif, ders, unite, konu, kazanim, kullanici) " + 
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var inserts = [soru, cevap, zorluk, tarih, seviye, sinif, ders, unite, konu, kazanim, kullanici];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('soruEkle', {
                    mesaj: 'err',
                    soru: soru, cevap: cevap,
                    zorluk: zorluk, tarih: tarih,
                    kullanici: kullanici, seviye: seviye,
                    sinif: sinif, ders: ders,
                    unite: unite, konu: konu,
                    kazanim: kazanim, session: req.session
                });
                throw err
            } else {
                con.query("SELECT * FROM seviye WHERE isDeleted = false", function (err, result, fields) {
                    if (err) { throw err; } else { seviye = result; }
                    con.query("SELECT * FROM sinif WHERE isDeleted = false", function (err, result, fields) {
                        if (err) { throw err; } else { sinif = result; }
                        con.query("SELECT * FROM ders WHERE isDeleted = false", function (err, result, fields) {
                            if (err) { throw err; } else { ders = result; }
                            con.query("SELECT * FROM unite WHERE isDeleted = false", function (err, result, fields) {
                                if (err) { throw err; } else { unite = result; }
                                con.query("SELECT * FROM konu WHERE isDeleted = false", function (err, result, fields) {
                                    if (err) { throw err; } else { konu = result; }
                                    con.query("SELECT * FROM kazanim WHERE isDeleted = false", function (err, result, fields) {
                                        if (err) { throw err; } else { kazanim = result; }
                                        res.render('soruEkle', { mesaj: 'ok', seviye: seviye, sinif: sinif, ders: ders, unite: unite, 
                                        konu: konu, kazanim: kazanim, session: req.session });
                                    });
                                });
                            });
                        });
                    });
                });
            };
        });

    } else {
        res.redirect('/403');
    }
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