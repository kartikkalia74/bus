const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    location:{type:String,required:true},
    locationCoords:{
        type:{type:String, default:"Point"},
        coordinates:{type:[Number], required:true}
    }
})
locationSchema.index({locationCoords:'2dsphere'});
const Location = mongoose.model('location',locationSchema);
module.exports={Location}