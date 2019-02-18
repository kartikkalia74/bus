const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coupanSchema = new Schema ({
    code:{type:String ,required:true},
    description:{type:String ,required:true},
    discount:{type:Number},
    discountType:{type:String , enum:['rs','$']},
    validFrom:{type:Date},
    validUntil:{type:Date},
    timeOfUsage:{type:Number ,default:0}, 
    minValue:{type:Number},
    maxValue:{type:Number},
    isEnabled:{type:Boolean, default:false}


});

coupanSchema.statics.createCoupon = function(code,description,discount,discountType,validFrom,validUntil,minvalue,maxValue){

}

let Coupons = mongoose.model('coupons',coupanSchema);

module.exports  ={Coupons }