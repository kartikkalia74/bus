const express = require("express");
const Route = express.Router();
const {Hotel} = require('../../models/hotels/hotel');
const {Rooms} = require('../../models/hotels/rooms');

Route.post('/create',(req,res)=>{
    console.log("inn")
    const {name,location,type,address} = req.body;
    const newHotel = new Hotel({name:name,type:type,address:address})
    console.log(newHotel,'newhotel',location[0],location[1]) 
    newHotel.location.coordinates.push(location[0],location[1])
    newHotel.save().then((hotelSaved)=>res.send({status:true,data:hotelSaved}))
    .catch(err=>console.log(err))
    console.log("old",newHotel,"new")
})

Route.post('/room',(req,res)=>{
    const {roomCapacity,hotelId,noOfRooms} = req.body;
    console.log(req.body)
    Rooms.createRooms(hotelId,roomCapacity,noOfRooms,function(savedrooms){
        res.send({status:true,data:savedrooms})
    })
});

Route.post('/updatePrice',(req,res)=>{
    const {hotelId,price,roomType} = req.body;
    Hotel.updatePrice(hotelId,price,roomType,function(raw){
        res.send({status:true,data:raw})
    })
})



module.exports = Route