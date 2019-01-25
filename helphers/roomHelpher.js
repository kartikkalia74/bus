const roomhelphers ={};


roomhelphers.createArrOfRange=(roomCapacity,range)=>{
    console.log(range,"range")
let arr =[];
for(let i=0;i<range;i++){
    arr.push({roomCapacity:roomCapacity})
}
console.log(arr)
return arr
}



module.exports = {roomhelphers};