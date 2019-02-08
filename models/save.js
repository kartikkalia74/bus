const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const saveSchema = new Schema({
    _id:{type:Number},
    grades:[
        {
            grade:{type:Number},mean:{type:Number},std:{type:Number}
    }]
})


 const Save= mongoose.model('save',saveSchema);

 module.exports={Save}