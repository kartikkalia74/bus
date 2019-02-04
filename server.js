const http = require('http');
const app = require('./app');
const port =5002;
const server =http.createServer(app);
server.listen(port,()=>{
    console.log('listning on port '+port)
})
