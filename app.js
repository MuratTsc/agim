/**
 * başlatmak için:
 * npm start
 */
//kütüphaneler import ediliyor
var fs = require('fs'); //filesystem kütüphanesi

var express = require('express');
var session = require('express-session');
var path = require('path');
var app = express();    //express kütüphanesinin nesnesi
app.use(session({ secret: 'agimSecretValueForSession', resave: false, saveUninitialized: true }));
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var db = require('./app_server/model/db');
// var ElektronikRoute


//ejs tanımları
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/app_server/views'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//modülü ektif ediyoruz
app.use(ejsLayouts);

//haritalama (kullanıcıya klasör erişim izni verme)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Yönlendirmeler için routeManager.js sayfası çağırılıyor
require('./app_server/router/routeManager')(app);


app.listen(8000);