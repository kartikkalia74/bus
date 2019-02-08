const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coupanSchema = new Schema ({
    code:{type:String},
    description:{type:String},
    discount:{type:Number},
    discountType:{type:String , enum:['%','$']},
    validFrom:{type:Date},
    validUntil:{type:Date},
    timeOfUsage:{type:Number ,default:0}, 
    minValue:{type:Number},
    maxValue:{type:Number},
    isEnabled:{type:Boolean, default:false}


});



let Coupons = mongoose.model('coupons',coupanSchema);

module.exports  ={Coupons }