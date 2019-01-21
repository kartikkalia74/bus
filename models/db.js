const mongoose = require('mongoose');

const uri =`mongodb://ank:ank123@ds259144.mlab.com:59144/login`;

mongoose.connect(uri,{useNewUrlParser:true},function(err){
    if(err) {
        console.log(err)
    }else{
        console.log('connected to mongolab instance')
    }
})


module.exports ={mongoose};