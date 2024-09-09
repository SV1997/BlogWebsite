import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function Notifications() {
  const [followRequests,setFollowRequests]=useState([])
  const navigate=useNavigate()
  useEffect(() => {
async function getfollowers(){
  const res= await axios.post('https://blogwebsite-1-wxmh.onrender.com/api/v1/user/followerequests',{},{
    withCredentials: true,  // Ensures that cookies, including session cookies, are sent with the request
    headers: {
        'Content-Type': 'application/json'
    }})
  console.log(res.data);
  setFollowRequests(res.data)
}
getfollowers()
  },[])
  return (
    <div className='mt-20'><ul>
      {followRequests.length>0&&followRequests.map((request)=>{
        {console.log(request);
        }
        return <li>
<div onClick={()=>{
      navigate(`/profiles`,{state:{email:request.email}})
    }} className='border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden flex items-center p-4 cursor-pointer'>
  <img className='rounded-full w-16 h-16 flex-shrink-0 mr-4 object-cover' src={request.profileImage ? request.profileImage : 'https://blogwebsite-1-wxmh.onrender.com/uploads/nouserimage.png'} alt="Profile" />
  <div>
    <p className='text-lg font-semibold'>{request.name}</p>
    <p className='text-sm text-gray-600'>{request.email}</p>
  </div>
</div>
        </li>
      })}
      </ul></div>
  )
}

export default Notifications