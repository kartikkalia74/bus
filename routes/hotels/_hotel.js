     /*                      hote Dashboard                                                */

const express = require("express");
const Route = express.Router();
const mongoose = require("mongoose");

// imports 
 let {Hotel} = require('../../models/hotels/hotel');
 let {Books} = require('../../models/hotels/booking');
 let {HotelAdmins} = require('../../models/hotels/hotelAdmin')
 

    /* login hotel dashboard */
    //required field : none

Route.get('/login',(req,res)=>{
    console.log(req.body)
   res.render('login',{hotelId:null})
   console.log(req.cookies)
})
    /*checking valid user*/
    
    // required field : username ,password
Route.post('/_',(req,res)=>{
    const {username,password} = req.body;

 HotelAdmins.authenticate(username,password,function(hotelId){
   console.log(hotelId)
   if(hotelId.status===true){
       HotelAdmins._(hotelId.hotelId,function(hotelDetail){
           res.cookie('id',hotelId.hotelId)
        res.render('_hotel',{hotelDetail:hotelDetail})
       })
       
   }else{
       res.render('login',{hotelId})
   }
 })

})

  /*displaying booking list   */
    //required field: hotelId 

Route.get('/bookings',(req,res)=>{
    Books.booking(req.cookies.id,function(bookingList){
        console.log(bookingList,'hgh')
        res.render('booking',{bookingList})
    })
})





Route.get('/updatePrice',(req,res)=>{
    res.render('updatePrice')
})


Route.post('/updatePrice',(req,res)=>{
         const {price,roomType} = req.body;
        console.log(req.body,req.cookies)
    Hotel.updatePrice(hotelId=req.cookies.id,price,roomType,function(raw){
       res.redirect('price')
    })  
})

Route.get('/checkOut/:Id',(req,res)=>{
   console.log(req.params.Id)
 Books.checkOut(bookingId=req.params.Id,function(raw){
     console.log(raw,'hjsj')
     res.redirect('bookings')
 }) 
})


Route.get("/booking",(req,res)=>{
    Books.find({},{name:1,username:1,phone:1},function(err,bookingList){
        if(err) throw err;
        res.send({status:true,data:bookingList})
    });
});
Route.get('/price',async(req,res)=>{
let data = await Hotel.findOne({_id:mongoose.Types.ObjectId(req.cookies.id)})
    console.log(data.price.singleRoom);
    res.render('price',{data});
})

Route.get('/logout',(req,res)=>{
    console.log('logout')
res.clearCookie('id');
res.redirect('login');
})
module.exports = Route

/* 
    bookings singleRooms doubleRooms tripleRooms fourpeopleRooms
 
*/