const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const saveSchema = new Schema({
    _id:{type:Number},
    status:{type:String },
    changeLog:[{Type:String}],
    comments:[{by:String,body:String,rating:Number}]
})


 const Save= mongoose.model('save',saveSchema);

 module.exports={Save}