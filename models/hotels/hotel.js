const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const {HotelZone} = require('./hotel_zone')
const {roomhelphers} = require('../../helphers/roomHelpher');

const hotelSchema = new Schema({
name:{
    type:String,
    required:true
},

location:{
    type:{
        type:String,
        default:"Point"
    },

    coordinates:{
        type:[Number],
        required:true
    }                 
},

type:{
    type:String,
    enum:["3","5"]
},

image:{
    type:String
},

address:{
    type:String
},

booking:{
    singleRooms:[{_id:mongoose.Types.ObjectId,checkIn: Date,checkOut: Date}],
    doubleRooms:[{_id:mongoose.Types.ObjectId,checkIn:  Date,checkOut: Date}],
    tripleRooms:[{_id:mongoose.Types.ObjectId,checkIn:Date,checkOut:Date}],
    fourPeopleRoom:[{_id:mongoose.Types.ObjectId,checkIn:Date,checkOut:Date}]

},

amenities:{
    type:String,
    enum:["gym","swimmingPool","RoomService"]
},

roomAvailable:{ 
    type:Number
},

price:{

    singleRooms:{
        type:Number
    },

    doubleRooms:{
        type:Number
    },

    tripleRooms:{
        type:Number
    },

    fourPeopleRoom:{
        type:Number
    }
},

    singleRooms:[
        {
              type:mongoose.Schema.Types.ObjectId
        }    
    ],
    
    doubleRooms:[],
    
    tripleRooms:[],
    fourPeopleRoom:[],
    availableRooms:[{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'room'
    }],
    
   

});

hotelSchema.post('save',function(doc,next){
    console.log(doc,'hjgsfjhf')
    HotelZone.create({_id:doc._id,name:doc.name,type:'hotel'},function(err,data){
        if(err) throw err;
       console.log('data',data)
       next()
     }) 
})

hotelSchema.statics.updatePrice= function(hotelId,price,roomType,cb){
        const availRoomType= ["singleRoom","doubleRoom","tripleRoom","fourPeopleRoom"];
        const priceField=availRoomType[roomType-1];
    return this.updateOne(
        {_id:hotelId},
        {
            $set:{
                [`price.${priceField}`]:price
            }
        },function(err,raw){
            if(err) throw err;
            console.log(raw,'raw')

        cb(raw)
    })
}

hotelSchema.statics.search = function(point1,point2,point3,point4,point5,cb){
    return this.aggregate([
        {
            $match:{
                location:{
                    $geoWithin:{
                        $geometry:{
                            type:"Polygon",
                            coordinates:[[
                                    point1,point2,point3,point4,point5
                            ]]
                        }
                    }
                }
            }
        },
    {
        $project:{
        booking:1,
        name:1
    }
},

{
    $project:{
        searchList:1
        
    }
}
],
    function(err,places){
        if (err) throw err;
        console.log(places)
        cb(places)
    }) 
}


hotelSchema.statics.findHotel = function (searchName,searchType,checkIn ,checkOut,roomType,noOfPerson,cb){
   
    mongoose.model('zone').aggregate([
            { 
                $match:{
                    zoneName:searchName
                }
            },
            {
                $lookup:{
                    from:'hotels',
                    localField:'hotelList',
                    foreignField:'_id',
                    as:"searchList"
                }
            },
            {
                $project:{
                    searchList:1,
                    _id:0
                }
            },
            {
             "$unwind":"$searchList"   
            },
            {
                $project:{
                    "searchList.name":1,
                        "searchList._id":1,
                    /* [`searchList.booking.${roomType}`]:1,
                    [`searchList.${roomType}`]:1, */
                    "searchList.image":1,
                    bookingList:{
                        $size:`$searchList.booking.${roomType}`
                    },
                    roomList:{
                        $size:`$searchList.${roomType}`
                    }
                }   
            },
            {
                $project:{
                    searchList:1,
                    /* bookingList:1,
                    roomList:1, */
                    available:{$subtract:["$roomList","$bookingList"]}
                }
            },
            {$sort:{available:-1}}
            
           
                  
    ],function(err,data){
        if(err) throw err;
        cb(data)
    })    
    
}
        
    /* if(data.length<=0){
        mongoose.model('hotel').find({name:searchName},function(err,searchHotelList){
            if(err) throw err;
            console.log(searchHotelList,'searchHotelList')
            cb(searchHotelList)
        })
    }else{
        cb(data)
    } */
 

hotelSchema.statics._hotel = function(hotelId){
    this.aggregate([
        {
            $match:{_id:mongoose.Types.ObjectId(hotelId)}
        }
        
    ],
    function(err,hotelData){
        if(err) throw err;
        console.log(data,'jkj')
    })

}

hotelSchema.statics.hotelList = function  (cb){
    this.find({},"name",function(err,hotelList){
        if(err) throw err;
        cb(hotelList)
    })
}

/* hotelSchema.statics.count=function(){
   return this.count()
} */

hotelSchema.statics.index = function(cb){
    let callbackObj = {};
    this.count(function(err,hotelCount){
    if(err) throw err;
    callbackObj.hotelCount=hotelCount;
  mongoose.model('zone').countDocuments(function(err,zoneCount){
      if(err) throw err;
      callbackObj.zoneCount=zoneCount;
   mongoose.model('Book').countDocuments(function(err,bookingCount){
       if(err) throw err;
       callbackObj.bookingCount = bookingCount;
    mongoose.model('coupons').countDocuments(function(err,couponCount){
        callbackObj.couponCount= couponCount;
        if(err) throw err;
        cb(callbackObj)
        })   
     
    })   
      })  
})
}


hotelSchema.statics.createHotel = function(name,address,long,lat,singleRooms,doubleRooms,zoneName,cb){
    this.create({name,address,"location.coordinates":[long,lat]},function(err,hotelDetails){
        if(err) throw err
        else{
                if(singleRooms>0){
                    mongoose.model('room').insertMany( roomhelphers.createArrOfRange(1,singleRooms,hotelDetails._id),function(err,singleRoomDetail){
                         if(err) throw err;
                        mongoose.model('hotel').updateOne({_id:mongoose.Types.ObjectId(hotelDetails._id)},{$addToSet:{singleRooms:singleRoomDetail.map(each=>each._id)}},function(err,raw){
                            if(err) throw err;
                            console.log(raw)
                        })
                    })
                }
                if(doubleRooms>0){
                    mongoose.model('room').insertMany( roomhelphers.createArrOfRange(2,doubleRooms,hotelDetails._id),function(err,doubleRoomDetail){
                         if(err) throw err
                        mongoose.model('hotel').updateOne({_id:mongoose.Types.ObjectId(hotelDetails._id)},{$addToSet:{singleRooms:doubleRoomDetail.map(each=>each._id)}},function(err,raw){
                            if(err) throw err;
                            console.log(raw)
                        })
                    })
                }
                mongoose.model('zone').updateOne({zoneName},{$addToSet:{hotelList:mongoose.Types.ObjectId(hotelDetails._id)}},function(err,raw){
                    if(err) throw err;
                    console.log(raw)
                })
                mongoose.model('hotel').find({},{name:1},function(err,hotelList){
                    if(err) throw err;
                    cb(hotelList)
            })
        }
    })
}



hotelSchema.index({location:"2dsphere"})

const Hotel  = mongoose.model('hotel',hotelSchema);

module.exports={Hotel};
