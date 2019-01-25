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
    type:mongoose.Schema.Types.ObjectId ,
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

rooms:{

    singleRooms:[{

        type:mongoose.Schema.Types.ObjectId ,
        ref:'room'
    }],
    
    doubleRooms:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'room'
    }],
    
    tripleRooms:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'room'
    }],
    fourPeopleRoom:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'room'
    }],
    availableRooms:[{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'room'
    }],
    
    bookedRooms:[{
        type:mongoose.Schema.Types.ObjectId,
         ref:'room' 
         ,default:null
        }]
},

});


hotelSchema.virtual('singleRoomLength')
.get(function(){
    return this.singleRooms.length;

});

hotelSchema.virtual('totalRooms')
.get(function(){
    console.log('vitua;')
    return this.availableRooms.length+this.bookedRooms.length
});

hotelSchema.virtual('doubleRoomLength')
.get(function(){
    if(this.doubleRooms.length){
        return this.doubleRooms.length;
    }
    
});

hotelSchema.virtual('tripleRoomLength')
.get(function(){
    return this.tripleRooms.length;
});

hotelSchema.virtual('fourPeopleRoomLength').get(function(){
    return this.fourPeopleRoom.length;
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



hotelSchema.index({location:"2dsphere"})

const Hotel  = mongoose.model('hotel',hotelSchema);
module.exports={Hotel};

