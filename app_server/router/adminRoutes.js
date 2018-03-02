var express = require('express');

var router = express.Router();

var ctrlAdmin = require('../controller/adminController');

router.get('/', ctrlAdmin.indexGet);
router.post('/', ctrlAdmin.indexPost);
router.get('/logout', ctrlAdmin.logoutGet);

router.get('/kurumlar', ctrlAdmin.kurumlarGet);
router.get('/kurumDuzenle/:kurumId', ctrlAdmin.kurumDuzenleGet);
router.post('/kurumDuzenle/:kurumId', ctrlAdmin.kurumDuzenlePost);
router.get('/kurumEkle/', ctrlAdmin.kurumEkleGet);
router.post('/kurumEkle', ctrlAdmin.kurumEklePost);

router.get('/kullaniciEkle', ctrlAdmin.kullaniciEkleGet);
router.post('/kullaniciEkle', ctrlAdmin.kullaniciEklePost);

//Anasayfa işlemlerinin yönlendirmeleri
router.get('/mpGenelAyarlar', ctrlAdmin.mpGenelAyarlarGet);
router.post('/mpGenelAyarlar', ctrlAdmin.mpGenelAyarlarPost);

router.get('/mpHeader', ctrlAdmin.mpHeaderGet);
router.post('/mpHeader', ctrlAdmin.mpHeaderPost);

router.get('/mpIntro', ctrlAdmin.mpIntroGet);
router.post('/mpIntro', ctrlAdmin.mpIntroPost);

router.get('/mpFeatured', ctrlAdmin.mpFeaturedGet);
router.post('/mpFeatured', ctrlAdmin.mpFeaturedPost);

router.get('/mpAbout', ctrlAdmin.mpAboutGet);

router.get('/mpServices', ctrlAdmin.mpServicesGet);
router.post('/mpServices', ctrlAdmin.mpServicesPost);

router.get('/mpCallToAction', ctrlAdmin.mpCallToActionGet);
router.post('/mpCallToAction', ctrlAdmin.mpCallToActionPost);

router.get('/mpFacts', ctrlAdmin.mpFactsGet);
router.post('/mpFacts', ctrlAdmin.mpFactsPost);

router.get('/mpClients', ctrlAdmin.mpClientsGet);
router.post('/mpClients', ctrlAdmin.mpClientsPost);

router.get('/mpContact', ctrlAdmin.mpContactGet);
router.post('/mpContact', ctrlAdmin.mpContactPost);

router.get('/mpFooter', ctrlAdmin.mpFooterGet);


module.exports = router;