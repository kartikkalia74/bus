const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {roomhelphers} =require('../../helphers/roomHelpher')

const RoomSchema = new Schema({

    isBooked:{
        type:Boolean ,
        default:false
    },

    roomCapacity:{
        type:Number,
         enum:[1,2,3,4] ,
         default:1,
         min:1,
         max:4
    },

    personResiding:{
        type:Number,
        default:1,
        max:4,
        min:1
    },

    checkIn:{
        type:Date,
        default:null
    },

    checkOut:{
        type:Boolean,
        default:null
    } 
})
//inserting no. of rooms(insert many) with room type
/* 
//required fields
hotelId
roomCapacity type ["single" , double,triple]
noOfRooms  
*/
RoomSchema.statics.createRooms = function(hotelId,roomCapacity,noOfRooms,cb){
    const availableRoomType = ["singleRooms","doubleRooms","tripleRooms","fourPeopleRoom"];
    const roomType = availableRoomType[roomCapacity-1];
        console.log(noOfRooms,"noofrooms")
         return  this.insertMany(
             roomhelphers.createArrOfRange(roomCapacity,noOfRooms),
             function(err,roomList){
                if(err) throw err;
            
                let roomIds=roomList.map((room)=>room._id);

         mongoose.model("hotel").updateOne({
             _id:hotelId
            },
            {
                $addToSet:{
                    [`rooms.${roomType}`]:{
                        $each:roomIds
                    },
                    availableRooms:{
                        $each:roomIds
                    }
                } 
            },
                function(err,result){
                    console.log(result)
                    if(err) throw err;
                    mongoose.model('hotel').findById(hotelId,function(err,hotelDetails){
                        if(err) throw err;
                        cb(hotelDetails)
                    })
         }) 
        
    }) 
   
}
const Rooms = mongoose.model('room',RoomSchema);

module.exports={Rooms};