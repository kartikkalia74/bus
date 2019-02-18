const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const zoneSchema = new Schema({
zoneName:{
    type:String
},
location:{
    type:{
        type:String,
        default:"Polygon"
    },
    coordinates:{
        type:[[[Number]]] ,
        required:true}
},
hotelList:[
    {
        type:mongoose.Schema.Types.ObjectId ,
        ref:"hotel"
    }
]
});


zoneSchema.statics.createZone= function(zoneName,point1,point2,point3,point4,point5,cb){
    this.create({zoneName,"location.coordinates":[[point1,point2,point3,point4,point5]]},function(err,data){
        if(err) throw err;
        console.log(data,"Res")
        cb(data)
        
        
    })
}

const Zones= mongoose.model('zone',zoneSchema);

module.exports = {Zones};