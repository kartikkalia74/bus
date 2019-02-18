const mongoose = require("mongoose") ;
const Schema = mongoose.Schema;   

const hotel_zoneSchema = new Schema({
    _id:{
        type:mongoose.Schema.Types.ObjectId
    },
    name:{
        type:String
    },
    type:{
        type:String,
         enum:['hotel','zone']
        }


});

hotel_zoneSchema.statics.list =function(){
    this.find({},function(err,searchList){
        if(err) throw err;
        console.log(searchList,'searchList')
    })
}

const HotelZone = mongoose.model('hotel_zone',hotel_zoneSchema);

module.exports = {HotelZone};