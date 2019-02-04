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
        type:mongoose.Schema.Types.ObjectId
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
                    $lt:{"$date":toDate}
                }
            }]
        }]
    }
}])
}

BookSchema.statics.bookRoom = function(name,username,phone,roomType,checkIn,checkOut,noOfRooms,noOfPersons,hotelId,cb){
    
    const PossibleroomType =["singleRooms","doubleRooms","tripleRooms","fourPeopleRooms"]
            roomType = PossibleroomType[roomType-1];
         // for getting roomsIs for booking
        mongoose.model('hotel').aggregate([
            {
                $match:{
                    _id:mongoose.Types.ObjectId(hotelId)
                }
            },
            {
                $project:{
                    _id:0,
                    [roomType]:{
                        $filter:{
                            input:`$${roomType}`,
                            as:"room",
                             cond:{$eq:["$$room.isBooked",false]}
                        }
                    }   
                }
            }
            ],function(err,data){
            if(err) throw err;
                console.log(data[0].singleRooms)
                if(data[0].singleRooms.length>=noOfPersons){
                    let roomsIds = data[0].singleRooms.map(room=>room.roomId).slice(0,noOfRooms)
                      mongoose.model('Book').create({name,username,phone,checkIn,checkOut,noOfPersons,Rooms:roomsIds,hotelId,roomType},function(err,savedBooking){
                          if(err) throw err;
                          
                        let   bookingObj =  {rooms:roomsIds,roomType,checkIn:Date(checkIn),checkOut:Date(checkOut)}
                                let Bulk = mongoose.model('hotel').collection.initializeOrderedBulkOp() ;
                                
                                mongoose.model('hotel').updateOne({_id:mongoose.Types.ObjectId(hotelId) },{$set:{[`${roomType}.$[room].isBooked`]:true}},{arrayFilters:[{["room._id"]:{$in:[roomsIds]}}],multi:true},function(err,raw){
                                    if(err) throw err;
                                    console.log(raw)
                                })
                         /*  mongoose.model('hotel').updateOne({_id:hotelId},{$addToSet:{bookedRooms:bookingObj }},function(err,raw){
                              if(err) throw err;
                              console.log(raw)

                          }) */
                         
                      });
                        
                   /*  mongoose.model('hotel').updateOne({_id:mongoose.Types.ObjectId(hotelId)},{$addToSet:{}}) */
                }else{

                }
            
        })

         /*  mongoose.model('hotel').aggregate([
              {
                  $match:{
                      _id:mongoose.Types.ObjectId(hotelId)
                    }
                },
                {$project:{singleRooms:1}}
            
            ],function(err,result){
              if(err) throw err;
              console.log(result)
          }) */
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