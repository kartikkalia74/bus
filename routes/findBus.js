const express = require("express");
const Route = express.Router();
const {Bus} = require('../models/busBooking/bus');
Route.post('/',(req,res)=>{
    const {source ,destination} = req.body;
    Bus.findbus(destination,source,function(Ress){
        console.log(Ress,"ress")
        if(Ress){
            res.send({status:true,data:Ress})
        }
        
    })
   /*  Bus.find({route:{$all:[source,destination] }}).then((avalibleList)=>{
        console.log(avalibleList)
       return  res.send({"status":true,"list":avalibleLizirakpurst});
    })
    .catch((err)=>console.log(err))  */      

})

module.exports =Route;