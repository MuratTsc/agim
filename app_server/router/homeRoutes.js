var express = require('express');

var router = express.Router();

var ctrlHome = require('../controller/homeController');

router.get('/', ctrlHome.index);
// router.get('/index.html', ctrlHome.index);
router.get('/flot', ctrlHome.flot);
router.get('/tables', ctrlHome.tables);

router.get('/kullanicilar', ctrlHome.kullanicilar);
router.get('/kullanicilar/:kullaniciId', ctrlHome.kullaniciDuzenle);
router.post('/kullanicilar', ctrlHome.kullaniciDuzenlePost);
router.get('/kullaniciEkle', ctrlHome.kullaniciEkleGet);
router.post('/kullaniciEkle', ctrlHome.kullaniciEklePost);
router.delete('/kullanicilar', ctrlHome.kullaniciSil);

router.get('/akademikKurul', ctrlHome.akademikKurul);
router.get('/akademikKurul/:raporId', ctrlHome.akademikRaporDuzenle);
router.post('/akademikKurul', ctrlHome.akademikRaporDuzenlePost);

router.get('/materyalListesi', ctrlHome.materyalListesi);
router.get('/materyalDuzenle/:raporId', ctrlHome.materyalDuzenle);
router.post('/materyalDuzenle', ctrlHome.materyalDuzenlePost);
router.post('/materyal', ctrlHome.materyal);

router.get('/403', ctrlHome.yasak);
router.get('/hata', ctrlHome.hata);

router.get('/:404', ctrlHome.sayfaYok); //404 sayfası eklenebilir

module.exports = router;