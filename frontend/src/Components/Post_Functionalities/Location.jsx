import React, { useEffect, useState } from 'react'
import axios from 'axios';
function location({children,setRealLocation,setValue,...props}) {
    const [location, setLocation] = useState({latitude:null,longitude:null});
    const [error, setError] = useState('');
    const apiKey='5e113d3845fe4b71936e8bc9ec4efd3e'
    const url=`https://api.opencagedata.com/geocode/v1/json?q=${location.latitude}%2C${location.longitude}&key=${apiKey}`

    const getLocation=()=>{
        if(!navigator.geolocation){
            setError('Geolocation is not supported by your browser');
            return;
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        const {latitude,longitude}= position.coords;
        console.log(latitude,longitude);
        setLocation({latitude:latitude,longitude:longitude});
        setError(null);
        console.log(location);
    },()=>{
        setError('Unable to retrieve your location');   
    })}
useEffect(()=>{
    if(location.latitude===null){
        return
    }
    async function fetchLocation(){
        try{
    const response= await axios.get(url);
    const data= response.data;
    console.log(data.results[0].formatted);
    setValue('location',data.results[0].formatted);
    setRealLocation(data.results[0].formatted);        
}catch(err){
console.log(err);
}
}
fetchLocation();
},[location.longitude,location.latitude])
  return (
    <div className={'mx-2 mt-4'}>
        <label htmlFor="" onClick={getLocation}>{children}</label>
        <input type="text" value={`${location.latitude}, ${location.longitude}`} {...props} style={{display:'none'}}/>
        </div>
  )
}

export default location