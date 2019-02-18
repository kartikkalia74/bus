let helphers = {};

helphers.validation = (hotelname,address,long,lat,singleRooms,doubleRooms)=>{
   console.log(hotelname,address,long,lat,singleRooms,doubleRooms)
    hotelname = typeof(hotelname)==="string" && hotelname.length>4?hotelname:false;
    address = typeof(address)==="string"&&address.length>5?address:false;
    long   =typeof(long)==="number" ?long:false;
    lat   =typeof(lat)==="number" ?lat:false;
    singleRooms= typeof(singleRooms)==="number"&&singleRooms%1===0?singleRooms:false;
    doubleRooms = typeof(doubleRooms)==="number"&&doubleRooms%1===0?doubleRooms:false;
   let  errorMessage={
        singleRooms:'must be whole no',
        hotelname:'hotel name should be of length greter then 4',
        address:'hotel address should be of length greater then 5',
        long:'long should be a number',
        lat:'lat should be a number',
        doubleRooms:'doubleRooms must be whole no'
    }
       let errorFields = [hotelname,address,long,lat,singleRooms,doubleRooms]
       console.log(errorFields,'errorField')
      let filerederror = errorFields.filter((field)=>{
         if(field===false){
             
         }
        })
   console.log(filerederror,'gh')
}

module.exports = helphers