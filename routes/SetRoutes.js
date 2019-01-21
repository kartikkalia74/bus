const express = require("express");
const Route = express.Router();
const {Location} = require('../models/location');


Route.post('',(req,res)=>{
   console.log(req.body)
const {location,locationCoords} = req.body;
    
    const newLocation = new Location({})
    newLocation.location=location;
    console.log(newLocation,"check1")
    newLocation.locationCoords.coordinates.push(locationCoords[0],locationCoords[1]);
    console.log(newLocation,"check2")
    newLocation.save().then((result)=>{console.log(result); return res.send(result)})
    .catch(err=>console.log(err))

    
})

/* 
delhi:[76.7115704,30.7175308] ,_id: 5c457012d7a36038f9b6c459
zirakpur:[76.7510764,30.6591], _id: 5c4572e8d7a36038f9b6c45f
chandigarh :[76.7092053,30.7334435] _id: 5c45705bd7a36038f9b6c45a
una:[76.2005619,31.4685723],_id: 5c45708dd7a36038f9b6c45b
hamirpur:[76.4510967,31.6863014], 5c4570bfd7a36038f9b6c45c
baddi:[76.7211432,30.957954],_id: 5c45715ad7a36038f9b6c45d
shimla :[77.1031907,31.1049425],_id: 5c4571cdd7a36038f9b6c45e
kufri:[77.1976011,31.0979863],_id: 5c457a900fe6ee3fae8359ed
*/

/* 
sahi travels [delhi, zirakpur,chandigarh,una,hamirpur] [5c457012d7a36038f9b6c459,5c4572e8d7a36038f9b6c45f,5c45705bd7a36038f9b6c45a,5c45708dd7a36038f9b6c45b,5c4570bfd7a36038f9b6c45c]
ctu  [chandigarh,baddi,shimla,kufri,hamirpur][5c45705bd7a36038f9b6c45a,5c45715ad7a36038f9b6c45d, 5c4571cdd7a36038f9b6c45e,5c457a900fe6ee3fae8359ed,5c4570bfd7a36038f9b6c45c]
*/

module.exports = Route;