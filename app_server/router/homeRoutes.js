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
router.get('/akademikRaporEkle', ctrlHome.akademikRaporEkleGet);
router.post('/akademikRaporEkle', ctrlHome.akademikRaporEklePost);
router.post('/akademikRaporSil', ctrlHome.akademikRaporSilPost);

router.get('/dersListesi', ctrlHome.dersListesi);
router.post('/dersListesi', ctrlHome.sinifaGoreDersListesiPost);
router.get('/dersEkle', ctrlHome.dersEkleGet);
router.post('/dersEkle', ctrlHome.dersEklePost);
router.get('/dersDuzenle/:dersId', ctrlHome.dersDuzenleGet);
router.post('/dersDuzenle', ctrlHome.dersDuzenlePost);

router.get('/uniteListesi', ctrlHome.uniteListesi);
router.post('/uniteListesi', ctrlHome.derseGoreUniteListesiPost);
router.get('/uniteEkle', ctrlHome.uniteEkleGet);
router.post('/uniteEkle', ctrlHome.uniteEklePost);
router.get('/uniteDuzenle/:uniteId', ctrlHome.uniteDuzenleGet);
router.post('/uniteDuzenle', ctrlHome.uniteDuzenlePost);

router.get('/konuListesi', ctrlHome.konuListesi);
router.post('/konuListesi', ctrlHome.uniteyeGoreKonuListesiPost);
router.get('/konuEkle', ctrlHome.konuEkleGet);
router.post('/konuEkle', ctrlHome.konuEklePost);
router.get('/konuDuzenle/:konuId', ctrlHome.konuDuzenleGet);
router.post('/konuDuzenle', ctrlHome.konuDuzenlePost);

router.get('/kazanimListesi', ctrlHome.kazanimListesi);
router.post('/kazanimListesi', ctrlHome.konuyaGoreKazanimListesiPost);
router.get('/kazanimEkle', ctrlHome.kazanimEkleGet);
router.post('/kazanimEkle', ctrlHome.kazanimEklePost);
router.get('/kazanimDuzenle/:kazanimId', ctrlHome.kazanimDuzenleGet);
router.post('/kazanimDuzenle', ctrlHome.kazanimDuzenlePost);

router.get('/materyalListesi', ctrlHome.materyalListesi);
router.get('/materyalEkle', ctrlHome.materyalEkleGet);
router.post('/materyalEkle', ctrlHome.materyalEklePost);
router.get('/materyalDuzenle/:materyalId', ctrlHome.materyalDuzenleGet);
router.post('/materyalDuzenle', ctrlHome.materyalDuzenlePost);
router.post('/materyal', ctrlHome.materyal);

router.get('/rehberlikRaporListesi', ctrlHome.rehberlikRaporListesi);
router.get('/rehberlikRaporuEkle', ctrlHome.rehberlikRaporEkleGet);
router.post('/rehberlikRaporuEkle', ctrlHome.rehberlikRaporEklePost);

router.get('/soruListesi', ctrlHome.soruListesi);
router.get('/soruEkle', ctrlHome.soruEkleGet);
router.post('/soruEkle', ctrlHome.soruEklePost);

router.get('/403', ctrlHome.yasak);
router.get('/hata', ctrlHome.hata);

router.get('/:404', ctrlHome.sayfaYok); //404 sayfası eklenebilir

module.exports = router;