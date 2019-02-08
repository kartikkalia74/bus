const mongoose = require("mongoose");
const Schema = mongoose.Schema;


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

booking:[{
   id:{type:mongoose.Schema.Types.ObjectId },
   roomType:{type:String},
   bookingId:{type:mongoose.Schema.Types.ObjectId},
   chekIn:{type:Date},
   checkOut:{type:Date}
}],

amenities:{
    type:String,
    enum:["gym","swimmingPool","RoomService"]
},

roomAvailable:{ 
    type:Number
},

price:{

    singleRoom:{
        type:Number
    },

    doubleRoom:{
        type:Number
    },

    tripleRoom:{
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
    
    bookedRooms:[]
,

});




hotelSchema.statics.updatePrice= function(hotelId,price,roomType,cb){
        const availRoomType= ["singleRoom","doubleRoom","tripleRoom","fourPeopleRoom"];
        const priceField=availRoomType[roomType-1];
    return this.updateOne({_id:hotelId},{$set:{[`price.${priceField}`]:price}},function(err,raw){
        if(err) throw err;
        console.log(raw,'raw')

        cb(raw)
    })
}

hotelSchema.statics.search = function(point1,point2,point3,point4,point5,cb){
    return this.aggregate([{$match:{
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
    }},
    {
        $project:{
        booking:1,
        name:1
    }
},
{
    "$unwind":"$booking"
},
{
    "$lookup":{
    "from":"books",
    localField:"booking",
    foreignField:"_id",
    as:"bookingsDone"
}}],
    function(err,places){
        if (err) throw err;
        console.log(places)
        cb(places)
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
       cb(callbackObj)
   })   
      
  })  
})
}

hotelSchema.index({location:"2dsphere"})

const Hotel  = mongoose.model('hotel',hotelSchema);
module.exports={Hotel};

