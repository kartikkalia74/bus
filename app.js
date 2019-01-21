const express = require("express");
const app = express();
const findBus = require('./routes/findBus');
const {mongoose} = require('./models/db');
const createLocation = require('./routes/SetRoutes');
const createBus = require('./routes/createBus');

app.use(express.json())

app.use('/',findBus)
app.use('/saveLocation',createLocation);
app.use('/createBus',createBus)

module.exports =app;