const http = require('http');
const app = require('./app');
const port =5001;
const server =http.createServer(app);
server.listen(port,()=>{
   console.log(["delhi", "zirakpur","chandigarh","hamirpur"].reverse())
    console.log('listning on port '+port)
})
