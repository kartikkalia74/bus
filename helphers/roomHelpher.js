const roomhelphers ={};


roomhelphers.createArrOfRange=(roomCapacity,range,hotelId)=>{
    console.log(range,"range")
let arr =[];
for(let i=0;i<range;i++){
    arr.push({roomCapacity:roomCapacity,hotelId:hotelId})
}
console.log(arr)
return arr
}



module.exports = {roomhelphers};