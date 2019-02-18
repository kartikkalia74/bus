      /*        client Api        */


const express = require("express");
const Route= express.Router();
const {Hotel} = require("../../models/hotels/hotel");
const {Rooms}= require("../../models/hotels/rooms");
const {Books} = require("../../models/hotels/booking");
const {Zones} = require("../../models/ZONES/zone");
const  {Save}= require("../../models/save")




        /*searching for available hotel in zone with zone name    */
                /* or */
        /* searching for hotel with hotel name */

                // required fields
                /* search name 
                    search type : [hotel or zone]
                */ 
Route.post("/search",(req,res)=>{
    const {searchName,searchType,checkIn ,checkOut,roomType,noOfPerson } = req.body;
    Hotel.findHotel(searchName,searchType,checkIn ,checkOut,roomType,noOfPerson,function(seachList){
        console.log(seachList)
        res.send(seachList)
    })
});


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



/* {
   "_id" : 1,
   "grades" : [
      { "grade" : 80, "mean" : 75, "std" : 6 },
      { "grade" : 85, "mean" : 100, "std" : 4 },
      { "grade" : 85, "mean" : 100, "std" : 6 }
   ]
}
{
   "_id" : 2,
   "grades" : [
      { "grade" : 90, "mean" : 100, "std" : 6 },
      { "grade" : 87, "mean" : 100, "std" : 3 },
      { "grade" : 85, "mean" : 100, "std" : 4 }
   ]
} */

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