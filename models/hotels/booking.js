const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema ({
    name:{
        type:String
    },

    mobile:{
        type:Number
    },

    email:{
        type:String
    },

    checkIn:{
        type:Date
    },

    checkOut:{
        type:Date
    },

    noOfRooms:{
        type:Number
    },

    noOfPersons:{
        type:Number
    },
    roomType:{type:Number, enum:[1,2,3,4]}
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
                    $gt:{"$date":FromDate}
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
    const  hotels= this;
        console.log(`"${hotelId}"`)
        mongoose.model('hotel').aggregate([{
            $match:{_id:mongoose.Types.ObjectId(hotelId)}
        },
        {
            $lookup:{
                from:"books",
                localField:"booking",
                foreignField:"_id",
                as:"bookingLists"
            }
        },
        {
            $project:{
                bookingLists:1,
                name:1,
                "price.singleRoom":1
            }
        },{$match:{checkIn:{$gte:new Date("2008-09-15T15:53:00")}}}],function(err,result){
            if(err)console.log(err)
            console.log(result)
            cb(result)
        })




  /*   this.create({
         name,username,phone,roomType,checkIn,checkOut,noOfRooms,noOfPersons
     },
     function(err,save){
         if(err) throw err;
         console.log(save)
         console.log("this");
         mongoose.model('hotel').updateOne({_id:hotelId},{$addToSet:{booking:save._id}},function(err,raw){
             if(err) throw err;
             console.log(raw)
         })
     }) */
     
 }

const Book = mongoose.model('Book',BookSchema);

module.exports={Book}