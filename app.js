const express = require("express");
const app = express();
const findBus = require('./routes/findBus');
const {mongoose} = require('./db/db');
const createLocation = require('./routes/SetRoutes');
const createBus = require('./routes/createBus');
const hotel = require('./routes/hotels/createHotel');
const _hotel = require('./routes/hotels/_hotel');

app.use(express.json())
app.use('/',findBus);
app.use('/saveLocation',createLocation);
app.use('/createBus',createBus);
app.use('/hotel',hotel);
app.use('/_hotel',_hotel);

module.exports =app;