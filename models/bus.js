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
    currentRouteDirection:{type:String,enum:["up","down"], default:"up"},
    //all stoping points in route
    route:[{loc:{type:mongoose.Schema.Types.ObjectId,ref:'location'},time:{type:Date}}]
});
BusSchema.statics.findbus= function(source,destination,cb){
    console.log(source,destination,"check1")

    return this.find({$and:[]}).catch(err=>console.log(err))
}
BusSchema.index({"route.id":1})
const Bus = mongoose.model('bus',BusSchema);

module.exports={Bus};