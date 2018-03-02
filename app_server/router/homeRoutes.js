var express = require('express');

var router = express.Router();

var ctrlHome = require('../controller/homeController');

router.get('/', ctrlHome.index);
// router.get('/index.html', ctrlHome.index);

router.get('/kullanicilar', ctrlHome.kullanicilar);
router.get('/kullanicilar/:kullaniciId', ctrlHome.kullaniciDuzenle);
router.post('/kullanicilar', ctrlHome.kullaniciDuzenlePost);
router.get('/kullaniciEkle', ctrlHome.kullaniciEkleGet);
router.post('/kullaniciEkle', ctrlHome.kullaniciEklePost);
router.delete('/kullanicilar', ctrlHome.kullaniciSil);

router.get('/akademikKurul', ctrlHome.akademikKurul);
router.get('/akademikKurul/:raporId', ctrlHome.akademikRaporDuzenle);
router.post('/akademikKurul', ctrlHome.akademikRaporDuzenlePost);
router.get('/akademikRaporGoruntuleme/:akdRaporId', ctrlHome.akademikRaporGoruntuleme);
router.get('/akademikRaporEkle', ctrlHome.akademikRaporEkleGet);
router.post('/akademikRaporEkle', ctrlHome.akademikRaporEklePost);
router.post('/akademikRaporSil', ctrlHome.akademikRaporSilPost);

router.get('/zumreKurulu', ctrlHome.zumreKurul);
router.get('/zumreKurul/:raporId', ctrlHome.zumreRaporDuzenle);
router.post('/zumreKurul', ctrlHome.zumreRaporDuzenlePost);
router.get('/zumreRaporGoruntuleme/:zumreRaporId', ctrlHome.zumreRaporGoruntuleme);
router.get('/zumreRaporEkle', ctrlHome.zumreRaporEkleGet);
router.post('/zumreRaporEkle', ctrlHome.zumreRaporEklePost);
router.post('/zumreRaporSil', ctrlHome.zumreRaporSilPost);

router.get('/icraKurulu', ctrlHome.icraKurul);
router.get('/icraKurul/:raporId', ctrlHome.icraRaporDuzenle);
router.post('/icraKurul', ctrlHome.icraRaporDuzenlePost);
router.get('/icraRaporGoruntuleme/:icraRaporId', ctrlHome.icraRaporGoruntuleme);
router.get('/icraRaporEkle', ctrlHome.icraRaporEkleGet);
router.post('/icraRaporEkle', ctrlHome.icraRaporEklePost);
router.post('/icraRaporSil', ctrlHome.icraRaporSilPost);

router.get('/dersListesi', ctrlHome.dersListesi);
router.post('/dersListesi', ctrlHome.sinifaGoreDersListesiPost);
router.get('/dersEkle', ctrlHome.dersEkleGet);
router.post('/dersEkle', ctrlHome.dersEklePost);
router.get('/dersDuzenle/:dersId', ctrlHome.dersDuzenleGet);
router.post('/dersDuzenle', ctrlHome.dersDuzenlePost);
router.post('/dersSil', ctrlHome.dersSilPost);

router.get('/uniteListesi', ctrlHome.uniteListesi);
router.post('/uniteListesi', ctrlHome.derseGoreUniteListesiPost);
router.get('/uniteEkle', ctrlHome.uniteEkleGet);
router.post('/uniteEkle', ctrlHome.uniteEklePost);
router.get('/uniteDuzenle/:uniteId', ctrlHome.uniteDuzenleGet);
router.post('/uniteDuzenle', ctrlHome.uniteDuzenlePost);
router.post('/uniteSil', ctrlHome.uniteSilPost);

router.get('/konuListesi', ctrlHome.konuListesi);
router.post('/konuListesi', ctrlHome.uniteyeGoreKonuListesiPost);
router.get('/konuEkle', ctrlHome.konuEkleGet);
router.post('/konuEkle', ctrlHome.konuEklePost);
router.get('/konuDuzenle/:konuId', ctrlHome.konuDuzenleGet);
router.post('/konuDuzenle', ctrlHome.konuDuzenlePost);
router.post('/konuSil', ctrlHome.konuSilPost);

router.get('/kazanimListesi', ctrlHome.kazanimListesi);
router.post('/kazanimListesi', ctrlHome.konuyaGoreKazanimListesiPost);
router.get('/kazanimEkle', ctrlHome.kazanimEkleGet);
router.post('/kazanimEkle', ctrlHome.kazanimEklePost);
router.get('/kazanimDuzenle/:kazanimId', ctrlHome.kazanimDuzenleGet);
router.post('/kazanimDuzenle', ctrlHome.kazanimDuzenlePost);
router.post('/kazanimSil', ctrlHome.kazanimSilPost);

router.get('/materyalListesi', ctrlHome.materyalListesi);
router.post('/materyalListesi', ctrlHome.materyalListesiPost);
router.get('/materyalEkle', ctrlHome.materyalEkleGet);
router.post('/materyalEkle', ctrlHome.materyalEklePost);
router.get('/materyalDuzenle/:materyalId', ctrlHome.materyalDuzenleGet);
router.post('/materyalDuzenle', ctrlHome.materyalDuzenlePost);
router.post('/materyalSil', ctrlHome.materyalSilPost);

router.get('/rehberlikRaporListesi', ctrlHome.rehberlikRaporListesi);
router.get('/rehberlikRaporListesi/:rehberlikId', ctrlHome.rehberlikRaporGoruntuleme);
router.post('/rehberlikRaporListesi', ctrlHome.derseGoreRehberlikRaporListesiPost);
router.get('/rehberlikRaporuEkle', ctrlHome.rehberlikRaporEkleGet);
router.post('/rehberlikRaporuEkle', ctrlHome.rehberlikRaporEklePost);
router.get('/rehberlikRaporDuzenle/:rehberlikId', ctrlHome.rehberlikRaporDuzenleGet);
router.post('/rehberlikRaporDuzenle', ctrlHome.rehberlikRaporDuzenlePost);
router.post('/rehberlikRaporSil', ctrlHome.rehberlikRaporSilPost);

router.get('/soruListesi', ctrlHome.soruListesi);
router.get('/soruListesi/:soruId', ctrlHome.soruGoruntuleme);
router.post('/soruListesi', ctrlHome.soruListesiPost);
router.post('/soruListesiSil', ctrlHome.soruListesiSilPost);
router.get('/soruEkle', ctrlHome.soruEkleGet);
router.post('/soruEkle', ctrlHome.soruEklePost);
router.get('/soruDuzenle/:soruId', ctrlHome.soruDuzenleGet);
router.post('/soruDuzenle', ctrlHome.soruDuzenlePost);
router.post('/soruSil', ctrlHome.soruSilPost);

router.get('/profil', ctrlHome.kurumProfil);
router.post('/profil', ctrlHome.kurumProfilPost);

router.get('/403', ctrlHome.yasak);
router.get('/hata', ctrlHome.hata);

router.get('/:404', ctrlHome.sayfaYok);
router.get('/*', ctrlHome.sayfaYok);

module.exports = router;