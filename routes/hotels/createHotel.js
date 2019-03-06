      /*        client Api        */


const express = require("express");
const Route= express.Router();
const {Hotel} = require("../../models/hotels/hotel");
const {Rooms}= require("../../models/hotels/rooms");
const {Books} = require("../../models/hotels/booking");
const {Zones} = require("../../models/ZONES/zone");
const  {Save}= require("../../models/save");
const payment = require("../../helphers/stripe");
const {User} = require("../../models/hotels/user");

Route.get('/clientBooking',(req,res)=>{
    res.render('bookingClient')
});  

Route.get('/status',(req,res)=>{
    console.log(req.body,'hhh',req.query)
    const {searchType,searchName} = req.query;
    console.log(searchType,searchName,'jdjk')
    if(searchType==="hotel"){
        Hotel.find({},{name:1},function(err,hotelList){
            if(err) throw err;
            console.log(hotelList,'hotelList')
            res.send(hotelList)
        })
    }else if(searchType==="zone"){
        Zones.find({},{zoneName:1},function(err,zoneList){
            if(err) throw err;
            console.log(zoneList,'zoneList')
            res.send(zoneList)
        })
    }
})

Route.post("/search",(req,res)=>{
    const {searchName,searchType,checkIn ,checkOut,roomType,noOfPerson } = req.body;

    if(searchType==="zone"){
        Hotel.findHotelInZone(searchName.trim(''),checkIn ,checkOut,roomType,noOfPerson,function(searchList){
            res.send(searchList)
        });
    }else if(searchType==="hotel"){
        Hotel.findHotel(searchName,roomType,function(hotelDetails){
            res.send(hotelDetails)
        })
    }
});

Route.post("/checkOut",(req,res)=>{
    const {roomType,hotelId,checkIn,checkOut,noOfRooms,booking} = req.body;
    /* Hotel.checkOut(hotelId,roomType,checkIn,checkOut,noOfRooms,function(checkOut){
        res.send(checkOut)
    }) */
    Hotel.testCheckOut(hotelId,checkIn,checkOut,noOfRooms,booking,function(checkout){
        res.send(checkout)
    })
})

Route.post("/payment",(req,res)=>{
   let {customerId,sourceId,amount,currency,bookingId} = req.body;
   console.log(req.body)
   payment.charge(sourceId,amount,currency='usd',customerId,function(paymentDetails){
       res.send(paymentDetails)

   })
})

Route.post("/bookRoom",(req,res)=>{
    const {name,username,phone,roomType,checkIn,checkOut,noOfRooms,noOfPersons,hotelId} = req.body;
    console.log(req.body)
          Books.bookRoom(name,username,phone,roomType,checkIn,checkOut,noOfRooms,noOfPersons,hotelId,function(bookingList){
        res.send({
            status:true,
            data:bookingList
        }); 
    }) 
});

Route.post("/user",(req,res)=>{
    const {name,username,phone,email} = req.body;
    User.createUser(name,email,phone,function(userData){
        res.send(userData)
    }) 
})

Route.post("/login",(req,res)=>{
   const {username,password} = req.body;


})

Route.post('/signup',(req,res)=>{
    const {name,username,password,confirm} = req.body;

})





module.exports=Route;

/* 
1 Jw marriot chandigarh
 [Plot no: 6, Dakshin Marg, 35B, Sector 35, Chandigarh, 160035] 
 location:[76.764638,30.7267024]
 type:3
2 taj hotel chandigarh
[Block No 9 Sector 17 A, 17A, Sector 17, Chandigarh, 160017]
location[76.7831053,30.7453455]
type:5
3 Lalit Hotel Chandigarh
    location:[76.8392424,30.7306826]
    address:[lalit Hotel Industrial Aera, Rajiv Gandhi IT Park, Near DLF Commercial Complex, Chandigarh, Haryana 160101]
    type:5
4 Hotel Shivalikview
    address :Opp. Sampark, 17E, Chandigarh, 160017, India
    location:[76.77648,30.74015]
    type:5
*/

//zone 1 Polygon 
/* 
zone within chandigarh
point1: [76.72666,30.7376]
point2:[76.78193,30.75634]
point3:[76.81746,30.72403 ]
point4:[76.76373,30.70086]
point5:[76.72666,30.7376]
*/
//zone 2
/* 
chandigarh zone
point1:power grid station:[76.6825,30.72473],
point2:khuda lhora :[76.76902,30.77238],
point3:manimajra:[ 76.83013,30.71779],
point4:isser mohali library:[76.73108,30.66569]
*/


/* {
	"name":"mnfkj",
	"username":"kdjkj@jsdkj",
	"phone":"9593998993",
	"roomType":"1",
	"checkIn":"",
	"checkOut":"",
	"noOfRooms":1,
	"noOfPersons":"1",
	"hotelId":"5c4ed8898040413f2392558d"
}
'http://localhost:5000/hotel/bookRoom' */