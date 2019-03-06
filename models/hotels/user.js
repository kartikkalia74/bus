const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema ({
    name:{type:String},
    mobile:{type:String},
    email:{type:String},
    booking:[{type:mongoose.Schema.Types.ObjectId}]
});

userSchema.statics.createUser= function(name,email,mobile,cb){
    this.create({name,email,mobile},(err,userData)=>{
        if(err) throw err;
       cb(userData)
    })
}

const User = mongoose.model('users',userSchema);

module.exports = {User}