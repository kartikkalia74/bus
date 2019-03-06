const config = require('./config.json');

if(process.env.NODE_ENV==="production"){
    module.exports={dbUri:process.env.dbUri,host:process.env.host}
}else{
    module.exports= {dbUri:config.dbUri,host:config.host}
}

console.log(config.dbUri,process.env.NODE_ENV)
