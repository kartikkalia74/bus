const express = require("express");
const app = express();
const findBus = require('./routes/findBus');
const {mongoose} = require('./db/db');
const createLocation = require('./routes/SetRoutes');
const createBus = require('./routes/createBus');
const hotel = require('./routes/hotels/createHotel');
const _hotel = require('./routes/hotels/_hotel');
const {Save} = require('./models/save');
const path = require("path");
const bodyParser = require('body-parser');


console.log(path.join(__dirname, '/views/startbootstrap-sb-admin-2-gh-pages'))
app.set('views', path.join(__dirname, '/views/startbootstrap-sb-admin-2-gh-pages/'))
app.set('view engine','ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/',findBus);
app.use('/saveLocation',createLocation);
app.use('/createBus',createBus);
app.use('/hotel',hotel);
app.use('/_hotel',_hotel);

app.use(express.static(__dirname+'/views/startbootstrap-sb-admin-2-gh-pages/'))
app.use(express.static(__dirname+'/views/admin-panel/images'))
app.get('/save',(req,res)=>res.render('createHotel',{noOfHotels:6}))


module.exports =app;