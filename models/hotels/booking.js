const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BookSchema = new Schema({
    name: {
        type: String
    },

    phone: {
        type: Number
    },

    username: {
        type: String
    },

    checkIn: {
        type: Date
    },

    checkOut: {
        type: Date
    },

    Rooms: [{
        roomId: {
            type: mongoose.Schema.Types.ObjectId
        },
        roomType: {
            type: String
        }
    }],

    noOfPersons: {
        type: Number
    },
    roomType: {
        type: String,
        enum: ["singleRooms", "doubleRooms", "tripleRooms", "fourPeopleRooms"]
    },
    hotelId: {
        type: mongoose.Schema.Types.ObjectId
    }
})

BookSchema.statics.isbooked = function (FromDate, toDate, roomType) {
    return this.aggregate([{
        $match: {
            $and: [{
                    roomType: roomType
                },
                {
                    $and: [{
                            checkIn: {
                                $gt: {

                                    "$date": FromDate
                                }
                            }
                        },
                        {
                            checkOut: {
                                $lt: {
                                    "$date": toDate
                                }
                            }
                        }
                    ]
                }
            ]
        }
    }])
}

BookSchema.statics.bookRoom = function (name, username, phone, roomType, checkIn, checkOut, noOfRooms, noOfPersons, hotelId, cb) {

    const PossibleroomType = ["singleRooms", "doubleRooms", "tripleRooms", "fourPeopleRoom"]
    let type = PossibleroomType[roomType - 1];

    mongoose.model('Book').
    find({
            hotelId: mongoose.Types.ObjectId(hotelId),
            "Rooms.roomType": type,
            checkOut: {
                $gt: Date(checkIn)
            },
            checkIn: {
                $lt: Date(checkOut)
            }
        },
        function (err, BookingData) {
            if (err) throw err;
            console.log(BookingData, 'bookibng')
            let bookedRoomIds = BookingData.map(book => book.Rooms[0]).map(room => room.roomId);
            if (BookingData.length === 0) {
                mongoose.model('hotel').findById(mongoose.Types.ObjectId(hotelId), `${type}`, function (err, hotelRoomIds) {
                    if (err) throw err;
                    console.log(hotelRoomIds, 'before else')
                    let bookingRoomIds = hotelRoomIds[type].slice(0, noOfRooms).map((room) => {
                        return {
                            roomId: room,
                            roomType: type
                        }
                    });
                    console.log(bookingRoomIds, 'hj')
                    mongoose.model('Book').create({
                        name,
                        username,
                        phone,
                        checkIn :Date(checkIn),
                        Rooms: bookingRoomIds,
                        checkOut:Date(checkOut),
                        hotelId,
                        noOfPersons
                    }, function (err, bookingDetails) {
                        if (err) throw err;
                        console.log(bookingDetails, 'klkl');
                        mongoose.model('hotel').updateOne({
                            _id: mongoose.Types.ObjectId(hotelId)
                        }, {
                            $addToSet: {
                                [`booking.${type}`]:{_id: bookingDetails._id,
                                    checkIn: bookingDetails.checkIn,
                                    checkOut: bookingDetails.checkOut
                                }
                                
                                
                            }
                        },function(err,raw){
                            if(err) throw err;
                            cb(bookingDetails)
                        })
                        
                    })
                })
            } else {
                mongoose.model('hotel').aggregate([{
                        $match: {
                            _id: mongoose.Types.ObjectId(hotelId)
                        }
                    },
                    {
                        $project: {
                            [`${type}`]: 1

                        }
                    },
                    {
                        $unwind: {
                            path: `$${type}`,
                            preserveNullAndEmptyArrays: true

                        }
                    }, {
                        $match: {

                            [type]: {
                                $nin: bookedRoomIds
                            }
                        }
                    }
                ], function (err, hotelRoomIds) {
                    if (err) throw err;
                    console.log(hotelRoomIds.length);

                    if(hotelRoomIds.length>noOfRooms){
                        const toBookRoomIds = hotelRoomIds.slice(0, noOfRooms).map((room) => {
                            return {
                                roomId: room[type],
                                roomType: type
                            }
                        })
                        console.log(toBookRoomIds, 'toBookRoomsIds')
    
                        mongoose.model('Book').create({
                            name,
                            username,
                            phone,
                            checkIn:Date(checkIn),
                            Rooms: toBookRoomIds,
                            checkOut:Date(checkOut),
                            hotelId,
                            noOfPersons
                        }, function (err, BookingData) {
                            if (err) throw err;
                            console.log(BookingData, 'fhsjhj')
                            mongoose.model('hotel').updateOne({
                                _id: hotelId
                            }, {
                                $addToSet:  {
                                    [`booking.${type}`]:{
                                        _id: BookingData._id,
                                        checkIn: BookingData.checkIn,
                                        checkOut: BookingData.checkOut
                                    }  
                                }
                            }, function (err, hotelUpdate) {
                                if (err) throw err;
                                console.log(hotelUpdate)
                                cb(BookingData)
                            })
    
                        })
                    }else{
                        cb({status:404,message:"no room available"})
                    }

                })
            }
        })
}

BookSchema.statics.checkOut = function (bookingId, cb) {
    mongoose.model('Book').deleteOne({
        _id: bookingId
    }, function (err, status) {
        if (err) throw err;
        console.log(status)

        cb(status)
    })
}

BookSchema.statics.booking = function (hotelId, cb) {
    this.find({
        hotelId: mongoose.Types.ObjectId(hotelId)
    }, function (err, data) {
        if (err) throw err;
        console.log(data)
        cb(data)
    })
}

const Books = mongoose.model('Book', BookSchema);
module.exports = {
    Books
};

/* 

{   
    bookingId:''
    roomsIds:[]
    checkIn:,
    checkOut:,
    noOfPersons:,

}
*/