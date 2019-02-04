const express = require("express");
const app = express();
const findBus = require('./routes/findBus');
const {mongoose} = require('./db/db');
const createLocation = require('./routes/SetRoutes');
const createBus = require('./routes/createBus');
const hotel = require('./routes/hotels/createHotel');
const _hotel = require('./routes/hotels/_hotel');
const {Save} = require('./models/save');


app.use(express.json())
app.use('/',findBus);
app.use('/saveLocation',createLocation);
app.use('/createBus',createBus);
app.use('/hotel',hotel);
app.use('/_hotel',_hotel);
app.post('/save',(req,res)=>{
    const {_id,status,changelog,comments} = req.body;
    console.log(req.body,)
    Save.aggregate([{$match:{status:'published'}},{$unwind:"$comments"}],function(err,data){
        if(err) throw err;
        console.log(data)
    })
});
module.exports =app;