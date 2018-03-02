var con = require('../model/db');
var mysql = require('mysql');
var formidable = require('formidable');
var fs = require('fs');


module.exports.indexGet = function (req, res) {
    
    if (req.session.kurumId == 0) {
        //admin oturumu açık
        res.render('admin/home', { layout: 'admin/layout',
            session: req.session
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            // var sqlQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
            // var inserts = ["kurumlar", "subdomain", req.subdomains[0], "isDeleted", false];
            // sqlQuery = mysql.format(sqlQuery, inserts);
            // con.query(sqlQuery, function (err, result, fields) {
            //     if (err) throw err;
            //     if (result[0]) {
                    // res.render('login', { layout: 'login', logo: result[0].logo, mesaj: "" });
                // } else {
                    res.render('admin/login', { layout: 'admin/login', logo: "no", mesaj: ""});
                // }
            // });
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.indexPost = function (req, res) {

    var gelenMail = req.body.email;
    var gelenSifre = req.body.password;

    // var sqlQuery = "SELECT kullanici.id, kullanici.kullaniciAdi, kullanici.mail, kullanici.yetki, " +
    var sqlQuery = "SELECT * " +
    // "kurumlar.id AS kurumId, kurumlar.subdomain, kurumlar.isDeleted AS isKurumDeleted " +
    "FROM kullanici " +
    // "LEFT JOIN kurumlar ON kullanici.kurumId = kurumlar.id " +
    "WHERE (?? = ? OR ?? = ? ) AND ?? = ? AND ?? = ? AND ?? = ?";
    var inserts = ["kullaniciAdi", gelenMail, "mail", gelenMail, "sifre", gelenSifre, "isDeleted", "0", "kurumId", "0"];
    sqlQuery = mysql.format(sqlQuery, inserts);
    con.query(sqlQuery, function (err, result, fields) {
        if (err) throw err;
        //eşleşen kullanıcı varsa session oluşturuluyor
        if (result[0] && result[0].yetki == 0) {
            if (req.subdomains.length == 0) {
                req.session.kullaniciId = result[0].id;
                req.session.kullaniciAdi = result[0].kullaniciAdi;
                req.session.email = result[0].mail;
                req.session.yetki = result[0].yetki;
                req.session.kurumId = result[0].kurumId;
                req.session.subdomain = result[0].subdomain;
                res.render('admin/home', { layout: 'admin/layout',
                    session: req.session
                });
            } else {// buraya gerek yok alt domainden gelenler zaten kurumun login sayfasına yönlendiriliyor.
                // if (req.body.logo) {
                //     res.render('admin/login', { layout: 'admin/login', logo: req.body.logo, mesaj: "errPermission"});
                // } else {
                    res.render('admin/login', { layout: 'admin/login', logo: "no", mesaj: "errPermission"});
                // }
                // res.send("Yanlış kurum adresindesin.<br>Şu anki adresin: " + req.subdomains[0] + "<br>Yetkili olduğun adres: " + result[0].subdomain);
                // res.redirect("http://agim.com:8000");
            }
        } else {
            // if (req.body.logo) {
            //     res.render('admin/login', { layout: 'admin/login', logo: req.body.logo, mesaj: "errLogin"});
            // } else {
                res.render('admin/login', { layout: 'admin/login', logo: "no", mesaj: "errLogin"});
            // }
            // res.send("Hatalı Giriş. " + '<a href="login">Giriş Yap</a>');
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

//kurum işlemleri
module.exports.kurumlarGet = function (req, res) {
    
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        //admin oturumu açık
        var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
        var inserts = ["kurumlar", "isDeleted", false];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (!err) {
                res.render('admin/kurumlar', { layout: 'admin/layout',
                    kurumlar: result,
                    mesaj: "no",
                    session: req.session
                });
            } else {
                res.render('admin/kurumlar', { layout: 'admin/layout',
                    kurumlar: "",
                    mesaj: "<strong>Hata!</strong><br>" + err,
                    session: req.session
                });
            }
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.kurumDuzenleGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        //admin oturumu açık
        var sqlQuery = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
        var inserts = ["kurumlar", "id", req.params.kurumId, "isDeleted", false];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (!err && result[0]) {
                res.render('admin/kurumDuzenle', { layout: 'admin/layout',
                    kurum: result[0],
                    mesaj: "no",
                    session: req.session
                });
            } else {
                let mesaj = "<strong>Hata!</strong> Kurum bulunamadı.<br>";
                if (err) {
                    mesaj += err;
                }
                res.render('admin/kurumDuzenle', { layout: 'admin/layout',
                    kurum: "",
                    mesaj: mesaj,
                    session: req.session
                });
            }
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.kurumDuzenlePost = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        
        var kurumDuzenleForm = new formidable.IncomingForm();
        var dosyaYolu;
        kurumDuzenleForm.on('fileBegin', function (name, file){
            if (file.name) {
                var uzanti = file.name.split('.');
                file.path = './uploads/logo/logo_' + req.params.kurumId + "." + uzanti[((uzanti.length)-1)];
                dosyaYolu = file.path;
            }
        });
        
        kurumDuzenleForm.on('file', function (name, file){

        });
    
        var alanlar;
        kurumDuzenleForm.parse(req, function(err, fields, files) {
            if (err) next(err);

            alanlar = fields;
                if (!dosyaYolu) {
                    dosyaYolu = alanlar.dosyaYolu;
                }
            
            var sqlQuery = "UPDATE kurumlar SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ?";
            var inserts = [
                "kurum_adi", alanlar.kurumAdi,
                "subdomain", alanlar.kurumSubdomain,
                "slogan", alanlar.kurumSlogan,
                "adres", alanlar.kurumAdres,
                "telefon1", alanlar.kurumTelefon1,
                "telefon2", alanlar.kurumTelefon2,
                "fax", alanlar.kurumFax,
                "website", alanlar.kurumWebsite,
                "mail", alanlar.kurumMail,
                "logo", dosyaYolu,
                "id", alanlar.kurumId,
                "isDeleted", false,
            ];
            sqlQuery = mysql.format(sqlQuery, inserts);
            con.query(sqlQuery, function (err, result, fields) {
                if (err) {
                    res.render('admin/kurumDuzenle', { layout: 'admin/layout',
                        mesaj: "err",
                        kurum: {},
                        session: req.session
                    });
                } else {
                    con.query("SELECT * FROM kurumlar WHERE isDeleted = FALSE " +
                    "AND id = " + alanlar.kurumId, function (err, result, fields) {
                        if (result[0]){
                            res.render('admin/kurumDuzenle', { layout: 'admin/layout',
                                mesaj: "ok",
                                kurum: result[0],
                                session: req.session
                            });
                        } else {
                            res.redirect('admin/kurumlar');
                        }
                    });
                }
            });
        });
        
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.kurumEkleGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        //admin oturumu açık
        res.render('admin/kurumEkle', { layout: 'admin/layout',
            mesaj: "no",
            session: req.session
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.kurumEklePost = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        
        var kurumEkleForm = new formidable.IncomingForm();
        var dosyaYolu;
        kurumEkleForm.on('fileBegin', function (name, file){
            if (file.name) {
                var uzanti = file.name.split('.');
                file.path = './uploads/logo/logo_' + req.params.kurumId + "." + uzanti[((uzanti.length)-1)];
                dosyaYolu = file.path;
            }
        });
        
        kurumEkleForm.on('file', function (name, file){

        });
    
        var alanlar;
        kurumEkleForm.parse(req, function(err, fields, files) {
            if (err) next(err);

            alanlar = fields;
            if (!dosyaYolu) {
                dosyaYolu = alanlar.dosyaYolu;
            }

            var sqlQuery = "INSERT INTO kurumlar (??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var inserts = [
                "kurum_adi", "subdomain", "slogan", "adres", "telefon1",
                "telefon2", "fax", "website", "mail", "logo", "isDeleted",
                alanlar.kurumAdi, alanlar.kurumSubdomain, alanlar.kurumSlogan, alanlar.kurumAdres, alanlar.kurumTelefon1,
                alanlar.kurumTelefon2, alanlar.kurumFax, alanlar.kurumWebsite, alanlar.kurumMail, dosyaYolu, false
            ];
            sqlQuery = mysql.format(sqlQuery, inserts);
            con.query(sqlQuery, function (err, result, fields) {
                if (err) {
                    res.render('admin/kurumEkle', { layout: 'admin/layout',
                        mesaj: "<strong>Hata!</strong> Kurum eklenemedi.<br>" + err.message,
                        kurum: {},
                        session: req.session
                    });
                } else {
                    res.render('admin/kurumEkle', { layout: 'admin/layout',
                        mesaj: "ok",
                        kurum: {
                            kurumAdi: alanlar.kurumAdi,
                            subdomain: alanlar.kurumSubdomain,
                            slogan: alanlar.kurumSlogan,
                            adres: alanlar.kurumAdres,
                            telefon1: alanlar.kurumTelefon1,
                            telefon2: alanlar.kurumTelefon2,
                            fax: alanlar.kurumFax,
                            website: alanlar.kurumWebsite,
                            mail: alanlar.kurumMail,
                            logo: dosyaYolu,
                        },
                        session: req.session
                    });
                }
            });
            
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

//kullanıcı işlemleri
module.exports.kullaniciEkleGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        //admin oturumu açık
        var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
            var inserts = ["kurumlar", "isDeleted", false];
            sqlQuery = mysql.format(sqlQuery, inserts);
            con.query(sqlQuery, function (err, result, fields) {
                res.render('admin/kullaniciEkle', { layout: 'admin/layout',
                    mesaj: "no",
                    kurumlar: result,
                    session: req.session
                });
            });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.kullaniciEklePost = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var sqlQuery = "INSERT INTO kullanici (kullaniciAdi, sifre, mail, yetki, kurumId) VALUES (?, ?, ?, ?, ?)";
        var inserts = [req.body.kullaniciAdi, req.body.sifre, req.body.email, req.body.yetki, req.body.kurum];
        sqlQuery = mysql.format(sqlQuery, inserts);
        con.query(sqlQuery, function (err, result, fields) {
            if (err) {
                res.render('admin/kullaniciEkle', { layout: 'admin/layout',
                    mesaj: 'err',
                    session: req.session
                });
                console.log("adminController->kurumEklePost\n" + err);
            } else {
                var sqlQuery = "SELECT * FROM ?? WHERE ?? = ?";
                var inserts = ["kurumlar", "isDeleted", false];
                sqlQuery = mysql.format(sqlQuery, inserts);
                con.query(sqlQuery, function (err, result, fields) {
                    res.render('admin/kullaniciEkle', { layout: 'admin/layout',
                        mesaj: "ok",
                        kurumlar: result,
                        session: req.session
                    });
                });
            };
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

//Anasayfa İşlemleri
//Sayfa başlığı ve meta işlemleri
module.exports.mpGenelAyarlarGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            res.render('admin/mainPageSections/mpGenelAyarlar', { layout: 'admin/layout',
                mesaj: "no",
                head: main.head,
                session: req.session
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.mpGenelAyarlarPost = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            //gelenler değiştiriliyor
            main.head.title = req.body.pageTitle;
            main.head.meta.keywords = req.body.keywords;
            main.head.meta.description = req.body.description;
            
            //değişiklikler dosyaya yazılıyor
            fs.writeFile('public/mainpage_tr.json', JSON.stringify(main, null, 4), 'utf8', function (err, data) {
                if (err) {
                    res.render('admin/mainPageSections/mpGenelAyarlar', { layout: 'admin/layout',
                        mesaj: "<strong>Hata!</strong> Değişiklikler kayıt edilemedi.<br>" + err.message,
                        head: main.head,
                        session: req.session
                    });
                } else {
                    res.render('admin/mainPageSections/mpGenelAyarlar', { layout: 'admin/layout',
                        mesaj: "ok",
                        head: main.head,
                        session: req.session
                    });
                }
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

//Logo ve menü işlemleri
module.exports.mpHeaderGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            res.render('admin/mainPageSections/mpHeader', { layout: 'admin/layout',
                mesaj: "no",
                header: main.body.header,
                session: req.session
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.mpHeaderPost = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            //gelenler değiştiriliyor
            main.body.header.logo.title = req.body.logoTitle;
            main.body.header.menu.item1 = req.body.menuItem1;
            main.body.header.menu.item2 = req.body.menuItem2;
            main.body.header.menu.item3 = req.body.menuItem3;
            main.body.header.menu.item4 = req.body.menuItem4;
            main.body.header.menu.item5 = req.body.menuItem5;
            
            //değişiklikler dosyaya yazılıyor
            fs.writeFile('public/mainpage_tr.json', JSON.stringify(main, null, 4), 'utf8', function (err, data) {
                if (err) {
                    res.render('admin/mainPageSections/mpHeader', { layout: 'admin/layout',
                        mesaj: "<strong>Hata!</strong> Değişiklikler kayıt edilemedi.<br>" + err.message,
                        header: main.body.header,
                        session: req.session
                    });
                } else {
                    res.render('admin/mainPageSections/mpHeader', { layout: 'admin/layout',
                        mesaj: "ok",
                        header: main.body.header,
                        session: req.session
                    });
                }
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

//Slayt işlemleri
module.exports.mpIntroGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            res.render('admin/mainPageSections/mpIntro', { layout: 'admin/layout',
                mesaj: "no",
                intro: main.body.intro,
                session: req.session
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.mpIntroPost = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        /*
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            //JSON nesnesi
            main = JSON.parse(data);
            
            var introForm = new formidable.IncomingForm();
            var files = [], fields = [];
            introForm.on('field', function(field, value) {
                if(fields.length == 6 && field != "isActive"){
                    fields.push(["isActive", "false"]);
                }
                if(fields.length == 12 && field != "isActive"){
                    fields.push(["isActive", "false"]);
                }
                if(fields.length == 18 && field != "isActive"){
                    fields.push(["isActive", "false"]);
                }
                if(fields.length == 24 && field != "isActive"){
                    fields.push(["isActive", "false"]);
                }
                fields.push([field, value]);
            });

            introForm.on('fileBegin', function(field, file) {
                var uzanti;
                if (file.name) {
                    switch (field) {
                        case "upload1":
                            uzanti = file.name.split('.');
                            file.path = './public/dist/img/1' + "." + uzanti[((uzanti.length)-1)];
                            main.body.intro.slide1.img = file.path;
                            break;
                        case "upload2":
                            uzanti = file.name.split('.');
                            file.path = './public/dist/img/2' + "." + uzanti[((uzanti.length)-1)];
                            main.body.intro.slide2.img = file.path;
                            break;
                        case "upload3":
                            uzanti = file.name.split('.');
                            file.path = './public/dist/img/3' + "." + uzanti[((uzanti.length)-1)];
                            main.body.intro.slide3.img = file.path;
                            break;
                        case "upload4":
                            uzanti = file.name.split('.');
                            file.path = './public/dist/img/4' + "." + uzanti[((uzanti.length)-1)];
                            main.body.intro.slide4.img = file.path;
                            break;
                        case "upload5":
                            uzanti = file.name.split('.');
                            file.path = './public/dist/img/5' + "." + uzanti[((uzanti.length)-1)];
                            main.body.intro.slide5.img = file.path;
                            break;
                        default:
                            break;
                    }
                }
            });

            introForm.on('file', function(field, file) {
                console.log(file.name);
                files.push([field, file]);
            });
            
            introForm.on('end', function() {
                console.log('done');
                // res.redirect('/admin/mpIntro');
                // JSON
                    
                //JSON'dan gelenler değiştiriliyor
                //slide1
                main.body.intro.slide1.title = fields[1][1];
                main.body.intro.slide1.description = fields[2][1];
                main.body.intro.slide1.button.title = fields[3][1];
                main.body.intro.slide1.button.href = fields[4][1];
                
                //slide2
                main.body.intro.slide2.isActive = fields[5][1];
                main.body.intro.slide2.title = fields[7][1];
                main.body.intro.slide2.description = fields[8][1];
                main.body.intro.slide2.button.title = fields[9][1];
                main.body.intro.slide2.button.href = fields[10][1];
                
                //slide3
                main.body.intro.slide3.isActive = fields[11][1];
                main.body.intro.slide3.title = fields[13][1];
                main.body.intro.slide3.description = fields[14][1];
                main.body.intro.slide3.button.title = fields[15][1];
                main.body.intro.slide3.button.href = fields[16][1];
                
                //slide4
                main.body.intro.slide4.isActive = fields[17][1];
                main.body.intro.slide4.title = fields[19][1];
                main.body.intro.slide4.description = fields[20][1];
                main.body.intro.slide4.button.title = fields[21][1];
                main.body.intro.slide4.button.href = fields[22][1];
    
                //slide5
                main.body.intro.slide5.isActive = fields[23][1];
                main.body.intro.slide5.title = fields[25][1];
                main.body.intro.slide5.description = fields[26][1];
                main.body.intro.slide5.button.title = fields[27][1];
                main.body.intro.slide5.button.href = fields[28][1];
    
                // JSON

                // değişiklikler (JSON) dosyaya yazılıyor
                fs.writeFile('public/mainpage_tr.json', JSON.stringify(main, null, 4), 'utf8', function (err, data) {
                    if (err) {
                        res.render('admin/mainPageSections/mpIntro', { layout: 'admin/layout',
                            mesaj: "<strong>Hata!</strong> Değişiklikler kayıt edilemedi.<br>" + err.message,
                            intro: main.body.intro,
                            session: req.session
                        });
                    } else {
                        res.render('admin/mainPageSections/mpIntro', { layout: 'admin/layout',
                            mesaj: "ok",
                            intro: main.body.intro,
                            session: req.session
                        });
                    }
                });
            });

            introForm.parse(req, function(err, fields2, files2) {

            });

        });
*/
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}
//Slayt alt bölümü bölümü işlemleri
module.exports.mpFeaturedGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            res.render('admin/mainPageSections/mpFeatured', { layout: 'admin/layout',
                mesaj: "no",
                featured: main.body.main.featured,
                session: req.session
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.mpFeaturedPost = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            //gelenler değiştiriliyor
            main.body.main.featured.isActive = req.body.isActive;
            main.body.main.featured.item1.icon = req.body.icon1;
            main.body.main.featured.item1.title = req.body.itemTitle1;
            main.body.main.featured.item1.description = req.body.itemDesc1;
            main.body.main.featured.item2.icon = req.body.icon2;
            main.body.main.featured.item2.title = req.body.itemTitle2;
            main.body.main.featured.item2.description = req.body.itemDesc2;
            main.body.main.featured.item3.icon = req.body.icon3;
            main.body.main.featured.item3.title = req.body.itemTitle3;
            main.body.main.featured.item3.description = req.body.itemDesc3;
            
            //değişiklikler dosyaya yazılıyor
            fs.writeFile('public/mainpage_tr.json', JSON.stringify(main, null, 4), 'utf8', function (err, data) {
                if (err) {
                    res.render('admin/mainPageSections/mpFeatured', { layout: 'admin/layout',
                        mesaj: "<strong>Hata!</strong> Değişiklikler kayıt edilemedi.<br>" + err.message,
                        featured: main.body.main.featured,
                        session: req.session
                    });
                } else {
                    res.render('admin/mainPageSections/mpFeatured', { layout: 'admin/layout',
                        mesaj: "ok",
                        featured: main.body.main.featured,
                        session: req.session
                    });
                }
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

//Hakkımızla bölümü işlemleri
module.exports.mpAboutGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            res.render('admin/mainPageSections/mpAbout', { layout: 'admin/layout',
                mesaj: "no",
                about: main.body.main.about,
                session: req.session
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

//Özellikler bölümü işlemleri
module.exports.mpServicesGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            res.render('admin/mainPageSections/mpServices', { layout: 'admin/layout',
                mesaj: "no",
                services: main.body.main.services,
                session: req.session
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.mpServicesPost = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            //gelenler değiştiriliyor
            main.body.main.services.isActive = req.body.isActive;
            main.body.main.services.header.title = req.body.headerTitle;
            main.body.main.services.header.description = req.body.headerDesc;
            main.body.main.services.item1.icon = req.body.icon1;
            main.body.main.services.item1.title = req.body.itemTitle1;
            main.body.main.services.item1.description = req.body.itemDesc1;
            main.body.main.services.item2.icon = req.body.icon2;
            main.body.main.services.item2.title = req.body.itemTitle2;
            main.body.main.services.item2.description = req.body.itemDesc2;
            main.body.main.services.item3.icon = req.body.icon3;
            main.body.main.services.item3.title = req.body.itemTitle3;
            main.body.main.services.item3.description = req.body.itemDesc3;
            main.body.main.services.item4.icon = req.body.icon4;
            main.body.main.services.item4.title = req.body.itemTitle4;
            main.body.main.services.item4.description = req.body.itemDesc4;
            main.body.main.services.item5.icon = req.body.icon5;
            main.body.main.services.item5.title = req.body.itemTitle5;
            main.body.main.services.item5.description = req.body.itemDesc5;
            main.body.main.services.item6.icon = req.body.icon6;
            main.body.main.services.item6.title = req.body.itemTitle6;
            main.body.main.services.item6.description = req.body.itemDesc6;
            
            //değişiklikler dosyaya yazılıyor
            fs.writeFile('public/mainpage_tr.json', JSON.stringify(main, null, 4), 'utf8', function (err, data) {
                if (err) {
                    res.render('admin/mainPageSections/mpServices', { layout: 'admin/layout',
                        mesaj: "<strong>Hata!</strong> Değişiklikler kayıt edilemedi.<br>" + err.message,
                        services: main.body.main.services,
                        session: req.session
                    });
                } else {
                    res.render('admin/mainPageSections/mpServices', { layout: 'admin/layout',
                        mesaj: "ok",
                        services: main.body.main.services,
                        session: req.session
                    });
                }
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

//Davet bölümü işlemleri
module.exports.mpCallToActionGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            res.render('admin/mainPageSections/mpCallToAction', { layout: 'admin/layout',
                mesaj: "no",
                callToAction: main.body.main.callToAction,
                session: req.session
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.mpCallToActionPost = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            //gelenler değiştiriliyor
            main.body.main.callToAction.isActive = req.body.isActive;
            main.body.main.callToAction.title = req.body.callToActionTitle;
            main.body.main.callToAction.description = req.body.callToActionDesc;
            main.body.main.callToAction.button.title = req.body.btnTitle;
            main.body.main.callToAction.button.href = req.body.btnHref;
            
            //değişiklikler dosyaya yazılıyor
            fs.writeFile('public/mainpage_tr.json', JSON.stringify(main, null, 4), 'utf8', function (err, data) {
                if (err) {
                    res.render('admin/mainPageSections/mpcallToAction', { layout: 'admin/layout',
                        mesaj: "<strong>Hata!</strong> Değişiklikler kayıt edilemedi.<br>" + err.message,
                        callToAction: main.body.main.callToAction,
                        session: req.session
                    });
                } else {
                    res.render('admin/mainPageSections/mpcallToAction', { layout: 'admin/layout',
                        mesaj: "ok",
                        callToAction: main.body.main.callToAction,
                        session: req.session
                    });
                }
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

//Faaliyetler bölümü işlemleri
module.exports.mpFactsGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            res.render('admin/mainPageSections/mpFacts', { layout: 'admin/layout',
                mesaj: "no",
                facts: main.body.main.facts,
                session: req.session
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.mpFactsPost = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            //gelenler değiştiriliyor
            main.body.main.facts.isActive = req.body.isActive;
            main.body.main.facts.title = req.body.factsTitle1;
            main.body.main.facts.description = req.body.factsDesc1;
            // main.body.main.facts.img.src = req.body.imgSrc;
            // main.body.main.facts.img.alt = req.body.imgAlt;
            
            //değişiklikler dosyaya yazılıyor
            fs.writeFile('public/mainpage_tr.json', JSON.stringify(main, null, 4), 'utf8', function (err, data) {
                if (err) {
                    res.render('admin/mainPageSections/mpFacts', { layout: 'admin/layout',
                        mesaj: "<strong>Hata!</strong> Değişiklikler kayıt edilemedi.<br>" + err.message,
                        facts: main.body.main.facts,
                        session: req.session
                    });
                } else {
                    res.render('admin/mainPageSections/mpFacts', { layout: 'admin/layout',
                        mesaj: "ok",
                        facts: main.body.main.facts,
                        session: req.session
                    });
                }
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

//Referanslar bölümü işlemleri
module.exports.mpClientsGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            res.render('admin/mainPageSections/mpClients', { layout: 'admin/layout',
                mesaj: "no",
                clients: main.body.main.clients,
                session: req.session
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.mpClientsPost = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            //gelenler değiştiriliyor
            main.body.main.clients.isActive = req.body.isActive;
            main.body.main.clients.title = req.body.clientsTitle;
            main.body.main.clients.description = req.body.clientsDesc;
            
            //değişiklikler dosyaya yazılıyor
            fs.writeFile('public/mainpage_tr.json', JSON.stringify(main, null, 4), 'utf8', function (err, data) {
                if (err) {
                    res.render('admin/mainPageSections/mpClients', { layout: 'admin/layout',
                        mesaj: "<strong>Hata!</strong> Değişiklikler kayıt edilemedi.<br>" + err.message,
                        clients: main.body.main.clients,
                        session: req.session
                    });
                } else {
                    res.render('admin/mainPageSections/mpClients', { layout: 'admin/layout',
                        mesaj: "ok",
                        clients: main.body.main.clients,
                        session: req.session
                    });
                }
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

//İletişim bölümü işlemleri
module.exports.mpContactGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            res.render('admin/mainPageSections/mpContact', { layout: 'admin/layout',
                mesaj: "no",
                contact: main.body.main.contact,
                session: req.session
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

module.exports.mpContactPost = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            //gelenler değiştiriliyor
            main.body.main.contact.isActive = req.body.isActive;
            main.body.main.contact.header.title = req.body.headerTitle;
            main.body.main.contact.header.description = req.body.headerDesc;
            
            main.body.main.contact.info.address.icon = req.body.icon1;
            main.body.main.contact.info.address.title = req.body.itemTitle1;
            main.body.main.contact.info.address.description = req.body.itemDesc1;
            main.body.main.contact.info.address.descHref = req.body.itemDescHref1;
            main.body.main.contact.info.phone.icon = req.body.icon2;
            main.body.main.contact.info.phone.title = req.body.itemTitle2;
            main.body.main.contact.info.phone.description = req.body.itemDesc2;
            main.body.main.contact.info.phone.descHref = req.body.itemDescHref2;
            main.body.main.contact.info.email.icon = req.body.icon3;
            main.body.main.contact.info.email.title = req.body.itemTitle3;
            main.body.main.contact.info.email.description = req.body.itemDesc3;
            main.body.main.contact.info.email.descHref = req.body.itemDescHref3;
            
            //değişiklikler dosyaya yazılıyor
            fs.writeFile('public/mainpage_tr.json', JSON.stringify(main, null, 4), 'utf8', function (err, data) {
                if (err) {
                    res.render('admin/mainPageSections/mpContact', { layout: 'admin/layout',
                        mesaj: "<strong>Hata!</strong> Değişiklikler kayıt edilemedi.<br>" + err.message,
                        contact: main.body.main.contact,
                        session: req.session
                    });
                } else {
                    res.render('admin/mainPageSections/mpContact', { layout: 'admin/layout',
                        mesaj: "ok",
                        contact: main.body.main.contact,
                        session: req.session
                    });
                }
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}

//Alt bilgi bölümü işlemleri
module.exports.mpFooterGet = function (req, res) {
    if (req.session.kurumId == 0 && req.session.yetki == 0) {
        var main;
        fs.readFile('public/mainpage_tr.json', 'utf8', function (err, data) {
            if (err) throw err;
            main = JSON.parse(data);
            res.render('admin/mainPageSections/mpFooter', { layout: 'admin/layout',
                mesaj: "no",
                footer: main.body.footer,
                session: req.session
            });
        });
    } else {
        // oturum yok, giriş yapılmamış
        if (req.subdomains.length == 0) {//ana domainden gelmişse
            res.render('admin/hata', { layout: 'admin/hata', mesaj: "<strong>Bu sayfaya erişim yetkiniz yok!</strong>"});
        } else {//alt domainlerden gelmişse kendi login ekranına gönderiyoruz
            res.redirect('/login');
        }
    }
}