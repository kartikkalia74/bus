const express = require("express");
const Route = express.Router();
const {Hotel} = require('../../models/hotels/hotel');
const {Rooms} = require('../../models/hotels/rooms');
const {Zones} = require('../../models/ZONES/zone');
const {Books}  = require('../../models/hotels/booking');


// creating hotel and adding it to location zone
Route.post('/create',(req,res)=>{
    console.log("inn")
    const {name,location,type,address,zoneId} = req.body;
    Hotel.create({name,type,address,"location.coordinates":location},function(err,insertedHotel){
        if(err) throw err;        
        console.log(insertedHotel,"kl");
        Zones.updateOne({_id:zoneId},{$addToSet:{hotelList:insertedHotel._id}},function(err,updateDetails){
            if(err) throw err;
            console.log(updateDetails,"updatedetails")
            if(updateDetails.nModified===1){
                res.send({status:true,data:insertedHotel})
            }else{
                res.send({status:false,err:'err in update'})
            }
        })
    });

    /* const newHotel = new Hotel({name:name,type:type,address:address})
    console.log(newHotel,'newhotel',location[0],location[1]) 
    newHotel.location.coordinates.push(location[0],location[1])
    newHotel.save().then((hotelSaved)=>res.send({status:true,data:hotelSaved}))
    .catch(err=>console.log(err))
    console.log("old",newHotel,"new") */
});

// insert no. of rooms of specific type
Route.post('/room',(req,res)=>{
    const {roomCapacity,hotelId,noOfRooms} = req.body;
    console.log(req.body)
    Rooms.createRooms(hotelId,roomCapacity,noOfRooms,function(savedrooms){
        res.send({status:true,data:savedrooms});

    })
});

//updating price of specific type
Route.post('/updatePrice',(req,res)=>{
    const {hotelId,price,roomType} = req.body;
    Hotel.updatePrice(hotelId,price,roomType,function(raw){
        res.send({status:true,data:raw})
    })
})

//creating zone 
/* 
//required fields
name of zone:zoneName,
location:[point1,point2,point3,point4,point5]
*/
 Route.post("/zone",(req,res)=>{
     const {zoneName ,point1,point2,point3,point4,point5} = req.body;
    console.log(req.body)
    Zones.createZone(zoneName,point1,point2,point3,point4,point5,function(insertedZone){
        res.send({status:true,data:insertedZone})
    });
 })
Route.post('/checkOut',(req,res)=>{
        const {bookingId} = req.body;
    Books.checkOut(bookingId,checkOutTime)
    
    

})























// mohali region

/* 
 point 1 :30.66672, 76.73222,
 point 2:30.6896, 76.76466,
 point 3:30.75284, 76.71214,
 point4 :30.73941, 76.67626
*/

//chandigarh
/* 
chandigarh zone
point1:power grid station:[76.6825,30.72473],
point2:khuda lhora :[76.76902,30.77238],
point3:manimajra:[ 76.83013,30.71779],
point4:isser mohali library:[76.73108,30.66569]
*/

/* 
// 
Hotel Mirage Mohali,Chandigarh
location:[30.6947205,76.7143257],
address:SCO 21-22-23-24, Sector 70, Sahibzada Ajit Singh Nagar, Punjab 160071
*/

/* 
Hotel Daawat
location:[30.7160595,76.7134906]
address:SCO 10C, Mohali Stadium Road, Near Reliance Fresh, Phase 5, Sector 59, Sahibzada Ajit Singh Nagar, Punjab 160059

*/

module.exports = Route