const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BookSchema = new Schema ({
    name:{
        type:String
    },

    phone:{
        type:Number
    },

    username:{
        type:String
    },

    checkIn:{
        type:Date
    },

    checkOut:{
        type:Date
    },

    Rooms:[{
        roomId:{
            type:mongoose.Schema.Types.ObjectId
        },
        roomType:{
            type:String
        }
    }],

    noOfPersons:{
        type:Number
    },
    roomType:{
        type:String, 
        enum:["singleRooms","doubleRooms","tripleRooms","fourPeopleRooms"]
    },
    hotelId:{
        type:mongoose.Schema.Types.ObjectId
    }
})

BookSchema.statics.isbooked =function(FromDate,toDate,roomType){
return this.aggregate([{
    $match :{
        $and:[{
            roomType:roomType
        },
        {
            $and:[{
                checkIn:{
                    $gt:{

                        "$date":FromDate
                    }
                }
            },
            {
                checkOut:{
                    $lt:{
                        "$date":toDate
                    }
                }
            }]
        }]
    }
}])
}

BookSchema.statics.bookRoom = function(name,username,phone,roomType,checkIn,checkOut,noOfRooms,noOfPersons,hotelId,cb){
    
    const PossibleroomType =["singleRooms","doubleRooms","tripleRooms","fourPeopleRooms"]
          let  type = PossibleroomType[roomType-1];
            
          mongoose.model('Book').
          find({
              hotelId:mongoose.Types.ObjectId(hotelId),
              "Rooms.roomType":type,
              checkOut:{
                  $gt:new Date(checkIn)
                },
                checkIn:{
                    $lt:new Date(checkOut)
                }
            },
            function(err,BookingData){
            if(err) throw err;
                let bookedRoomIds = BookingData.map(book=>book.Rooms[0]).map(room=>room.roomId);
                    if(BookingData.length<=0){
                        mongoose.model('hotel').findById(mongoose.Types.ObjectId(hotelId),`${type}`,function(err,hotelRoomIds){
                            if(err) throw err;
                            console.log(hotelRoomIds,'before else')
                          let bookingRoomIds =  hotelRoomIds[type].slice(0,noOfRooms).map((room)=>{
                                return {roomId:room ,roomType:type}
                            })
                            console.log(bookingRoomIds,'hj')
                            mongoose.model('Book').create({name,username,phone,checkIn,Rooms:bookingRoomIds,checkOut,hotelId,noOfPersons},function(err,bookingDetails){
                                if(err) throw err;
                                console.log(bookingDetails);
                                cb(bookingDetails);
                            })
                        })
                    }else{
                        mongoose.model('hotel').aggregate([
                            {
                            $match:{
                                _id:mongoose.Types.ObjectId(hotelId)
                            }
                        },
                        {
                            $project:{[`${type}`]:1
        
                        }
                    },
                        {
                            $unwind:{
                                path:`$${type}`,
                                preserveNullAndEmptyArrays:true
        
                            }
                        },{
                            $match:{
        
                                [type]:{$nin:bookedRoomIds}
                            }
                        }],function(err,hotelRoomIds){
                            if(err) throw err;
                            console.log(hotelRoomIds.length);
                            
                           const toBookRoomIds = hotelRoomIds.slice(0,noOfRooms).map((room)=>{
                               return {
                                   roomId:room[type],
                                   roomType:type
                                }
                            })
                           console.log(toBookRoomIds,'toBookRoomsIds')
                          
                           mongoose.model('Book').create({name,username,phone,checkIn,Rooms:toBookRoomIds,checkOut,hotelId,noOfPersons},function(err,BookingData){
                               if(err) throw err;
                               cb(BookingData)
                           })
        
                        })
                    }
                
            })
 }


 BookSchema.statics.checkOut = function(bookingId,cb){
    mongoose.model('Book').deleteOne({_id:bookingId},function(err,status){
        if(err) throw err;
        console.log(status)

        cb(status)
    })
 }

const Books = mongoose.model('Book',BookSchema);
module.exports={Books};

/* 

{   
    bookingId:''
    roomsIds:[]
    checkIn:,
    checkOut:,
    noOfPersons:,

}
*/