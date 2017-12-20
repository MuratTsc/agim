var express = require('express');

var router = express.Router();

var ctrlLogin = require('../controller/loginController');

// /login ile başlayan tüm istekleri cevap verir, next() metodu kullanılmazsa express sonraki middleware'lere ilerlemez
// router.use(function (req, res, next) {

//     if (req.session.email) {
//         console.log('daha önce giriş yapılmış anasayfaya gönderildi.');
//         res.redirect('/');
//     }
//     next();
// });

router.get('/', ctrlLogin.indexGet);
router.post('/', ctrlLogin.indexPost);
router.get('/logout', ctrlLogin.logoutGet);
router.get('/test', ctrlLogin.testGet);
// router.get('/signup', ctrlLogin.signupGet);
// router.post('/signup', ctrlLogin.signupPost);
// router.get('/kullanicilarListesi', ctrlLogin.kullanicilarListesi);
// router.get('/kullaniciSil/:kullaniciAdi', ctrlLogin.kullaniciSil);
// router.get('/kullaniciDuzenle', ctrlLogin.kullaniciDuzenleGet);
// router.get('/kullaniciDuzenle/:kullanici', ctrlLogin.kullaniciDuzenleGet);
// router.post('/kullaniciDuzenle', ctrlLogin.kullaniciDuzenlePost);

module.exports = router;