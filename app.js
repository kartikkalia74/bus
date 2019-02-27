const express = require("express");
const app = express();
const findBus = require('./routes/findBus');
const {mongoose} = require('./db/db');
const createLocation = require('./routes/SetRoutes');
const createBus = require('./routes/createBus');
const hotel = require('./routes/hotels/createHotel');
const admin = require('./routes/hotels/_admin');
const _hotel = require('./routes/hotels/_hotel');
const {Save} = require('./models/save');
const path = require("path");
const bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');


console.log(path.join(__dirname, '/views/appAdminBoard',))


  

app.set('views',path.join(__dirname,'/views/appAdminBoard/')) 
app.use(express.static(__dirname+'/views/appAdminBoard/'));
/*
 app.use(express.static(__dirname+'/views/hotelBoard/images')); 
 app.use(express.static(__dirname+'/views/hotelBoard/images')); 

app.use(express.static(__dirname+'/views/hotelBoard/'));
app.set('views',path.join(__dirname,'/views/hotelClient/')) */
app.set('view engine','ejs');
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/saveLocation',createLocation);
app.use('/createBus',createBus);
app.use('/hotel',hotel);
app.use('/_hotel',_hotel);
app.use('/_admin',admin);



module.exports =app;