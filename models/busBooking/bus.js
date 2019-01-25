const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BusSchema = new Schema({
    //company name
    operator:{type:String, required:true},
    // bus type sweeper / ac/ nonac
    type:{type:String,enum :["Ac","NonAc"] ,required:true},
    //time at which journey starts
    journeyStartOn:{type:Date},
    //time at which journey ends
    journeyEndOn:{type:Date},
    //is bus available for journey or not
    onJourney:{type:Boolean,default:false},
    //current position of journey
    currentPos:{type:String},
    //
    currentRouteDirection:{type:String,enum:["up","down"], default:"up"},
    //all stoping points in route
    route:[{type:mongoose.Schema.Types.ObjectId}],
    route:[{loc:{type:mongoose.Schema.Types.ObjectId,ref:'location'},time:{type:Date}}]
});
BusSchema.statics.findbus= function(source,destination,cb){
        console.log(source,destination,"check1")
    return this.find({$and:[{route:{$all:[source,destination]}},]}).populate({path:"route._id", model:"location" ,select:{location:1}}).exec((err,availableList)=>{
        if(err) console.log(err);
        cb(availableList)})
    }


const Bus = mongoose.model('bus',BusSchema);

module.exports={Bus};