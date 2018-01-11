var express = require('express');

var router = express.Router();

var ctrlLogin = require('../controller/loginController');

router.get('/', ctrlLogin.indexGet);
router.post('/', ctrlLogin.indexPost);
router.get('/logout', ctrlLogin.logoutGet);

module.exports = router;