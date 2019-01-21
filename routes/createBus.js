const express = require('express');
const Route = express.Router();
const {Bus} = require('../models/bus');
Route.post('',(req,res)=>{
    const  {operator,type,onJourney,route} = req.body;
        console.log(req.body)
        const newBus = new Bus({operator,type,onJourney})
        newBus.routeUp.push(...route)
        newBus.routeDown.push(...route.reverse())
        newBus.save().then((result)=>{console.log(result)
        res.send(result)
        }).catch((err)=>console.log(err))
})


module.exports = Route