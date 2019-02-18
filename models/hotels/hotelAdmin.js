const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let hotelAdminSchema = new Schema ({
    username:{type:String},
    password:{type:String},
    hotelId:{type:mongoose.Schema.Types.ObjectId}
});

hotelAdminSchema.statics.authenticate= function(username,password,cb){
    this.findOne({username:username},{password:1,hotelId:1},function(err,data){
        if(err) throw err;
            console.log(data)
            if(data==null){
                cb({status:false,error:'incorrect username'})
            }else if(data.password===password){
            cb({status:true,error:null,hotelId:data.hotelId})
        }else{
            cb({status:false,error:'incorrect password'})
        }
    })
}

hotelAdminSchema.statics.addAdmin = function(username,password,hotelName){
mongoose.model('hotel').findOne({name:hotelName},{_id:1},function(err,hotelId){
    if(err) throw err;
    mongoose.model('hotelAdmins').create({username},function(err,AdminCreated){
        if(err) throw err;
    })
})
}

hotelAdminSchema.statics._=  function (hotelId,cb){
    mongoose.model('hotel').aggregate(
        [{
            $match:{
                _id:mongoose.Types.ObjectId(hotelId)
            }
        },
        {
            $project:{
                singleRooms:{
                    $size:'$singleRooms'
                },
                doubleRooms:{
                    $size:'$doubleRooms'
                },
                threePeopleRooms:{
                    $size:'$tripleRooms'
                },
                fourPeopleRooms:{
                    '$size':'$fourPeopleRoom'
                }
            }
        }]
        ,async function(err,detail){
            if(err) throw err;
         let count =   await mongoose.model('Book').find({hotelId:mongoose.Types.ObjectId(hotelId)}).count()
            console.log(detail,count,'ghghg')
            detail[0].booking=count
            cb(detail[0])
        })
}

let HotelAdmins= mongoose.model('hotelAdmins',hotelAdminSchema);

module.exports = {HotelAdmins}
/*  */