const express = require("express");
const Route = express.Router();
const {Bus} = require('../models/bus');
Route.post('/',(req,res)=>{
    const {source ,destination} = req.body;
    Bus.findbus(source,destination,function(Ress){
        console.log(Ress,"ress")
    })
   /*  Bus.find({route:{$all:[source,destination] }}).then((avalibleList)=>{
        console.log(avalibleList)
       return  res.send({"status":true,"list":avalibleLizirakpurst});
    })
    .catch((err)=>console.log(err))  */      

})

module.exports =Route;