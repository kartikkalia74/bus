//dependencies
const express = require("express");
const Route = express.Router();



//models import
const {Hotel} = require('../../models/hotels/hotel');
const {Rooms} = require('../../models/hotels/rooms');
const {Zones} = require('../../models/ZONES/zone');
const {Books}  = require('../../models/hotels/booking');
const {Coupons} = require('../../models/hotels/coupon');
const helphers = require('../../helphers/validation')

   


   
Route.post("/zone",(req,res)=>{
    const {zoneName ,point1,point2,point3,point4,point5} = req.body;
   console.log(req.body)
   Zones.createZone(zoneName,point1,point2,point3,point4,point5,function(){
       res.send({status:true,data:insertedZone})
   });
})


Route.get("/createZone",(req,res)=>{
    res.render('createZone')
})
Route.post('/createZone',(req,res)=>{
   let {zoneName,coord1,coord2,coord3,coord4,coord5} =req.body
    console.log(req.body,'dfghj');
    Zones.createZone(zoneName,coord1,coord2,coord3,coord4,coord5,function(zoneList){
        res.redirect('zone')
    });
})


Route.get('/zone/:zoneName',(req,res)=>{
    console.log(req.params,req.query,'ghjkfghj')
    let {zoneName} = req.params;
    let {hotel} = req.query;
   
    if(zoneName&&hotel){
        console.log(hotel.trim(" "))
       Zones.aggregate([{
           $match:{
               zoneName
            }
       },
       {
           $lookup:{
           from:'hotels',
           localField:'hotelList',
           foreignField:'_id',
           as:'hotelDetail'
          }
        },
        {
            $project:{
                hotelDetail:1
            }
        },
        {
            $unwind:"$hotelDetail"
        },
        {
            $match:{
                "hotelDetail.name":hotel
            }
        } ,
        {
            $project:{
                "hotelDetail.name":1,
                "hotelDetail.address":1,
                "hotelDetail.type":1,
                "singleRooms":{$size:"$hotelDetail.singleRooms"},
                "doubleRooms":{$size:"$hotelDetail.doubleRooms"},
                "tripleRooms":{$size:"$hotelDetail.tripleRooms"}
            }
        } ],function(err,data){
           if(err) throw err;
           console.log(data,'ghjh')
          let {name,address} = data[0].hotelDetail
          let {singleRooms,doubleRooms,tripleRooms} = data[0]
           res.render('hotelDetail',{name,address,singleRooms,doubleRooms,tripleRooms})
       })

    }else if(zoneName&&!hotel){
        Zones.aggregate([{
            $match:{zoneName:req.params.zoneName}
        },
        {
            $lookup:{    
            from:'hotels',
            localField:'hotelList',
            foreignField:'_id',
            as:'hotelList'
             }
         },
        {
            $project:{
                "hotelList.name":1
             }
         }],(err,zoneDetails)=>{
         if(err) throw err;
         console.log(zoneDetails,'jkjjk')
         res.render('zoneHotels',{hotelList:zoneDetails[0].hotelList})
         
        })
    }
  
    console.log('fghj')
})

Route.get('/zone',(req,res)=>{
    Zones.find({},{zoneName:1},function(err,zoneList){
        if(err) throw err;
       res.render('zones',{zoneList})

    })
})

Route.get('/dashboard',(req,res)=>{
    Hotel.index(function(indexObj){
        console.log(indexObj,'ggggg')
        res.render('index',{indexObj})
    })
  console.log(req.body,'gh')

})

Route.post('/createHotel',(req,res)=>{
    let {name,address,long,lat,singleRooms,doubleRooms,zoneName} = req.body;
    console.log(req.body,'hjk')

     Hotel.createHotel(name,address,long,lat,singleRooms,doubleRooms,zoneName,function(hotelList){
        console.log(hotelList,'fghjkj')
        res.render('hotelList',{hotelList})
    }) 
})

Route.get('/createHotel',(req,res)=>{
    Zones.find({},{zoneName:1},function(err,zoneList){
        if(err) throw err;
        console.log(zoneList,'zoneList')
        return res.render('createHotel',{zoneList})
    })
  
})

Route.get('/hotelList',(req,res)=>{
    Hotel.find({},{name:1},function(err,hotelList){
        if(err) throw err;
        console.log(hotelList,'ghjk')
        res.render('hotelList',{hotelList})
    })
})

//updating price of specific type






/* Route.get("/hotelList",(req,res)=>{
    Hotel.hotelList(function(list){
        res.send(list)
    })
    
}) */

Route.get("/hotelCount",(req,res)=>{
    Hotel.countDocuments(function(err,count){
        if(err) throw err;
        res.send({status:true,data:count})
    })
})

Route.post('/createCoupon',(req,res)=>{
    const {code,description,discount,discountType,validFrom,validUntil,timeOfUsage,minValue,maxValue,minItems,maxItems} = req.body;
        console.log(req.body)
    Coupons.create({code,description,discount,discountType,validFrom,validUntil,timeOfUsage,minValue,maxValue},function(err,data){
        if(err) throw err;
        console.log(data)
        res.redirect('coupon')
    }) 
})
Route.get('/coupon/:code',(req,res)=>{
   let {code} = req.params;
    Coupons.deleteOne({code},function(err,raw){
        if(err) throw err;
        console.log(raw)
       res.redirect('/_admin/coupon')
    })

})
Route.get('/createCoupon',(req,res)=>{
    res.render('createCoupon')
})


Route.get('/coupon',(req,res)=>{
    Coupons.find({},function(err,couponsList){
        if(err) throw err;
        console.log(couponsList.length)
       res.render('coupons',{couponsList})
    })
})


Route.post('/create',(req,res)=>{
    const {username,password,hotelId} =  req.body;
    console.log(req.body,'ghgg')
   HotelAdmins.create({username,password,hotelId},function(err,hotelAdmins){
        if(err) throw err;
        console.log(hotelAdmins,'sssdsg');
        res.send(hotelAdmins)
    })
})
/* 
point1:[30.73478, 76.84275],
point2:[30.69538, 76.90009],
point3:[30.62406, 76.79417],
point4:[30.69006, 76.79349]
*/


 /* */
/*
30.769524,76.7822293dashboard
OYO 13102 Hotel Adarsh
hotel adarsh palace plot no 05 near p g i, Adarsh Nagar, Nayagaon, Punjab 160103 
 */

/*
 Sector 10, Chandigarh, 160011
 30.7537476,76.7863189
 Hotel Mountview
 */


/* 
 code
    description
    discount
    discountType
    validFrom
     validUntil
    timeOfUsage 
    minValue
    maxValue
    isEnabled

*/














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