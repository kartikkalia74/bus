const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const {HotelZone} = require('./hotel_zone');
const {roomhelphers} = require('../../helphers/roomHelpher');

const hotelSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    location: {
        type: {
            type: String,
            default: "Point"
        },

        coordinates: {
            type: [Number],
            required: true
        }
    },

    type: {
        type: String,
        enum: ["3", "5"]
    },

    image: {
        type: String
    },

    address: {
        type: String
    },

    booking: {
        singleRooms: [{
            _id: mongoose.Types.ObjectId,
            checkIn: Date,
            checkOut: Date
        }],
        doubleRooms: [{
            _id: mongoose.Types.ObjectId,
            checkIn: Date,
            checkOut: Date
        }],
        tripleRooms: [{
            _id: mongoose.Types.ObjectId,
            checkIn: Date,
            checkOut: Date
        }],
        fourPeopleRoom: [{
            _id: mongoose.Types.ObjectId,
            checkIn: Date,
            checkOut: Date
        }]

    },
    amenities: {
        type: String,
        enum: ["gym", "swimmingPool", "RoomService"]
    },
    roomAvailable: {
        type: Number
    },

    price: {

        singleRooms: {
            type: Number
        },

        doubleRooms: {
            type: Number
        },

        tripleRooms: {
            type: Number
        },

        fourPeopleRoom: {
            type: Number
        }
    },

    singleRooms: [{
        type: mongoose.Schema.Types.ObjectId
    }],

    doubleRooms: [],

    tripleRooms: [],
    fourPeopleRoom: [],
    availableRooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room'
    }],



});

hotelSchema.post('save', function (doc, next) {
    console.log(doc, 'hjgsfjhf')
    HotelZone.create({
        _id: doc._id,
        name: doc.name,
        type: 'hotel'
    }, function (err, data) {
        if (err) throw err;
        console.log('data', data)
        next()
    })
});

hotelSchema.statics.updatePrice = function (hotelId, price, roomType, cb) {
    const availRoomType = ["singleRoom", "doubleRoom", "tripleRoom", "fourPeopleRoom"];
    const priceField = availRoomType[roomType - 1];
    return this.updateOne({
        _id: hotelId
    }, {
        $set: {
            [`price.${priceField}`]: price
        }
    }, function (err, raw) {
        if (err) throw err;
        console.log(raw, 'raw')
        cb(raw)
    })
};

hotelSchema.statics.search = function (point1, point2, point3, point4, point5, cb) {
    return this.aggregate([{
                $match: {
                    location: {
                        $geoWithin: {
                            $geometry: {
                                type: "Polygon",
                                coordinates: [
                                    [
                                        point1, point2, point3, point4, point5
                                    ]
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    booking: 1,
                    name: 1
                }
            },

            {
                $project: {
                    searchList: 1

                }
            }
        ],
        function (err, places) {
            if (err) throw err;
            console.log(places)
            cb(places)
        })
};


hotelSchema.statics.findHotelInZone = function (searchName, checkIn, checkOut, roomType, noOfPerson, cb) {

    mongoose.model('zone').aggregate([{
            $match: {
                zoneName: searchName
            }
        },
        {
            $lookup: {
                from: 'hotels',
                localField: 'hotelList',
                foreignField: '_id',
                as: "searchList"
            }
        },
        {
            $project: {
                searchList: 1,
                _id: 0
            }
        },
        {
            "$unwind": "$searchList"
        },
        {
            $project: {
                "searchList.name": 1,
                "searchList._id": 1,
                /* [`searchList.booking.${roomType}`]:1,
                [`searchList.${roomType}`]:1, */
                "searchList.image": 1,
                price: `$searchList.price.${roomType}`,
                bookingList: {
                    $size: `$searchList.booking.${roomType}`
                },
                roomList: {
                    $size: `$searchList.${roomType}`
                }
            }
        },
        {
            $project: {
                hotelName:"$searchList.name",
                imageUrl:"$searchList.image",
                price: 1,
                /* bookingList:1,
                roomList:1, */
                available: {
                    $subtract: ["$roomList", "$bookingList"]
                }
            }
        },
        {
            $sort: {
                available: -1
            }
        }


    ], function (err, data) {
        if (err) throw err;
        cb(data)
    })

};

hotelSchema.statics.findHotel = function (searchName, roomType, cb) {
    this.aggregate([{
            $match: {
                name: searchName
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                price: `$price.${roomType}`,
                [`roomDetails.${roomType}`]: 1,
                image: 1,
                available: {
                    $subtract: [{
                            $size: `$${roomType}`
                        },
                        {
                            $size: `$booking.${roomType}`
                        }
                    ]
                }
            }
        }
    
    ], function (err, hotelDetail) {
        if (err) throw err;
        cb(hotelDetail)
    })
};

hotelSchema.statics._hotel = function (hotelId) {
    this.aggregate([{
            $match: {
                _id: mongoose.Types.ObjectId(hotelId)
            }
        }],
        function (err, hotelData) {
            if (err) throw err;
            console.log(hotelData, 'jkj')
        })
};

hotelSchema.statics.hotelList = function (cb) {
    this.find({}, "name", function (err, hotelList) {
        if (err) throw err;
        cb(hotelList)
    })
};

hotelSchema.statics.index = function (cb) {
    let callbackObj = {};
    this.count(function (err, hotelCount) {
        if (err) throw err;
        callbackObj.hotelCount = hotelCount;
        mongoose.model('zone').countDocuments(function (err, zoneCount) {
            if (err) throw err;
            callbackObj.zoneCount = zoneCount;
            mongoose.model('Book').countDocuments(function (err, bookingCount) {
                if (err) throw err;
                callbackObj.bookingCount = bookingCount;
                mongoose.model('coupons').countDocuments(function (err, couponCount) {
                    callbackObj.couponCount = couponCount;
                    if (err) throw err;
                    cb(callbackObj)
                })
            })
        })
    })
};


hotelSchema.statics.createHotel = function (name, address, long, lat, singleRooms, doubleRooms, zoneName, cb) {
    this.create({
        name,
        address,
        "location.coordinates": [long, lat]
    }, function (err, hotelDetails) {
        if (err) throw err
        else {
            if (singleRooms > 0) {
                mongoose.model('room').insertMany(roomhelphers.createArrOfRange(1, singleRooms, hotelDetails._id), function (err, singleRoomDetail) {
                    if (err) throw err;
                    mongoose.model('hotel').updateOne(
                        {
                        _id: mongoose.Types.ObjectId(hotelDetails._id)
                        },
                        {
                            $addToSet: {
                                singleRooms: singleRoomDetail.map(each => each._id)
                            }
                        },
                        function (err, raw) {
                            if (err) throw err;
                            console.log(raw)
                        })
                })
            }
            if (doubleRooms > 0) {
                mongoose.model('room').insertMany(roomhelphers.createArrOfRange(2, doubleRooms, hotelDetails._id), function (err, doubleRoomDetail) {
                    if (err) throw err
                    mongoose.model('hotel').updateOne({
                        _id: mongoose.Types.ObjectId(hotelDetails._id)
                    }, {
                        $addToSet: {
                            singleRooms: doubleRoomDetail.map(each => each._id)
                        }
                    }, function (err, raw) {
                        if (err) throw err;
                        console.log(raw)
                    })
                })
            }
            mongoose.model('zone').updateOne({
                zoneName
            }, {
                $addToSet: {
                    hotelList: mongoose.Types.ObjectId(hotelDetails._id)
                }
            }, function (err, raw) {
                if (err) throw err;
                console.log(raw)
            })
            mongoose.model('hotel').find({}, {
                name: 1
            }, function (err, hotelList) {
                if (err) throw err;
                cb(hotelList)
            })
        }
    })
};


hotelSchema.statics.checkOut = function(hotelId,roomType,checkIn,checkOut,noOfRooms,cb){
    console.log(hotelId,'htoelid')
     checkIn = Date.parse(checkIn);
      checkOut = Date.parse(checkOut);
        let difference = checkOut-checkIn;
        let  day = difference/(1000*60*60*24);

    this.aggregate([
        {
            $match:{_id:mongoose.Types.ObjectId(hotelId)}
        },
        {
            $project:{
                price:`$price.${roomType}`
            }
        },
        {
            $project:{  
                checkOut:{ 
                    noOfRooms:{"$literal":noOfRooms},
                    "price":"$price",
                    amount:{
                            $multiply:[`$price`,day,noOfRooms]
                    }
                }
            }
        },
        {
            $project:{
                "_id":0,
                "checkOut.noOfRooms":1,
                "checkOut.price":1,
                "checkOut.amount":1,
                "checkOut.discount":1,
                "checkOut.discount":{
                     $multiply:[{
                        $divide:[`$checkOut.amount`,100]
                    },5]
                },
                "checkOut.tax":{
                    $multiply:[{
                        $divide:[`$checkOut.amount`,100]
                        },10]
                    }
            }
        },
        {
            "$project":{
                checkOut:1,
                total:{
                    $subtract:[{
                        $sum:["$checkOut.amount","$checkOut.tax"]
                    },
                    "$checkOut.discount"]
                }
            }
        }
    ],function(err,checkOutDetail){
        if(err) throw err;
  
        console.log(checkOutDetail,'hhj',)
        cb(checkOutDetail)
    })
};

hotelSchema.statics.testCheckOut = function(hotelId,checkIn,checkOut,noOfRooms,booking,cb){
    console.log(booking,'hhhj')
    this.aggregate([
        {
           $match:{_id:mongoose.Types.ObjectId(hotelId)},
        },
        {
            $project:{
                price:1,
                booking:{
                    "$literal":booking
                },
                arrayPrice:{$objectToArray:"$price"}
            }
        },
       {    
           $project:{
            price:1,
            array:"$arrayPrice.v",
            booking:1   
               
            }
        },
        {
            $project:{
                price:1,
                "noOfRooms":{
                    $map:{input:"$booking",
                            as:"book",
                            in:{$divide:["$$book.noOfRooms",1]}
                }},
                "rate":{
                    $map:{   
                         input:"$booking",
                         as:"book",
                         in:{
                          "$arrayElemAt":["$array",{$subtract:["$$book.noOfPerson",1]}]
                         }
                     }
                 } 
            }
        },
        {
            $project:{
                arr:{ "$zip":{
                    inputs:["$rate","$noOfRooms"]
                }}
               

            }
        },
        {
            $project:{
                arr:1,
                mul:{
                    $map:{

                    input:"$arr",
                    as:"el",
                    in:{$multiply:[{$arrayElemAt:["$$el",0]},{$arrayElemAt:["$$el",1]}]}}
                }}
        }
         
      /*   {$project:{total:{$multiply:["$noOfRooms","$rate"]}}}
    */
    ],function(err,checkOutDetail){
        if(err) throw err;
        console.log(checkOutDetail)
        cb(checkOutDetail)
    })
};

hotelSchema.index({location: "2dsphere"});

const Hotel = mongoose.model('hotel', hotelSchema);

module.exports = {
    Hotel
};