const http = require('http');
const app = require('./app');
const port =5002;
const server =http.createServer(app);
server.listen(port,()=>{
    console.log('listning on port '+port)
})
/* 
{0,1,0,0}
{0,0,0,1}
{1,0,0,0}
{0,0,1,0}
*/