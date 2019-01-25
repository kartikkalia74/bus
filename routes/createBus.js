const express = require('express');
const Route = express.Router();
const {Bus} = require('../models/busBooking/bus');

Route.post('',(req,res)=>{

    const  {operator,type,onJourney,route} = req.body;

        console.log(req.body);
        const newBus = new Bus({operator,type,onJourney});
        newBus.route.push(...route);
        newBus.save().then((result)=>{console.log(result);
        res.send(result)
        }).catch((err)=>console.log(err))
})

/* 
chech for specific route 
[loc1,loc2...]
*/

module.exports = Route