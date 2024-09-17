import React from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {app} from '../firebase/firebaseConfig'
import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import axios from 'axios'
import useSocket from './useSocket'
import { useNavigate } from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {login as authLogin, logout} from '../store/authSlice'
import SocketContext from './SocketContext'
import { useContext } from 'react'
const auth= getAuth(app);
function Profile() {
  const navigate=useNavigate();
    const userData= useSelector(state=>state.auth.userData)
    const email= useSelector(state=>state.auth.userData.email)
    const[editProfile,setEditProfile]=useState(true)
    console.log(userData);
    const{register,handleSubmit}=useForm()
    const dispatch=useDispatch();
    const socket=useContext(SocketContext)
    const setUserData=async (data)=>{
      try{
      console.log(data);
      const formData=new FormData();
      formData.append('profileImage',(data.profileImage?data.profileImage[0]:userData.profileImage));
      formData.append('mobilenumber',data.mobilenumber);
      formData.append('profileName',data.profileName);
      formData.append('status',data.status); 
      formData.append('email',email);
      console.log(formData.get('profileImage'));
      const res=await axios.post('https://blogwebsite-1-wxmh.onrender.com/api/v1/user/edituserdata',formData,{
        headers:{
        "Content-Type": "multipart/form-data"
        }
      });
      console.log(res.data);
      sessionStorage.setItem('userInfo',JSON.stringify({...res.data,profileImage:'https://blogwebsite-1-wxmh.onrender.com/'+res.data.profileImage}))
      dispatch(authLogin({...res.data,profileImage:'https://blogwebsite-1-wxmh.onrender.com/'+res.data.profileImage}))
      setEditProfile(true)
    }
catch(err){
  console.log(err);
}
}
  return (
    <>
          
    <form action="" onSubmit={handleSubmit(setUserData)}>
    <div className='flex flex-col'>
    <div className='w-1/2'><img src={userData.profileImage} alt="" /></div>
    <Input {...register('profileImage')} className={`w-1/2`} type="file" placeholder='upload image' disabled={editProfile}/>
    <Input {...register('mobilenumber')} label='Mobile Number' value={userData.mobileNumber} className='w-1/2' type="text" placeholder='Mobile Number' disabled={editProfile}/>
    <Input {...register('profileName')} label='Profile Name' value={userData.name} className='w-1/2' type="text" placeholder='enter your profile name' disabled={editProfile}/>
    <Input {...register('status')} label='Status' className='w-1/2' value={userData.status} type="text" placeholder='Status' disabled={editProfile}/>
    </div>
   {editProfile&&<Button
    type='button'
    onClick={()=>setEditProfile(false)}
    className='w-full'>
        Edit Profile
    </Button>}
    {!editProfile&&<Button
    type='submit'
    className='w-full'>
        Submit
    </Button>}
    </form>

    <button onClick={async ()=>{
        auth.signOut()
        sessionStorage.clear()
      const res=await axios.post('https://blogwebsite-1-wxmh.onrender.com/api/v1/user/logout',{email:email},{
        withCredentials: true,  // Ensures that cookies, including session cookies, are sent with the request
        headers: {
            'Content-Type': 'application/json'
        }})
        console.log(res.data,"logout");
        const user=sessionStorage.getItem('userInfo')
        console.log(user);
        console.log(socket,"before");
        socket.disconnect();
        socket.off();
        console.log(socket,"socket after");
        
        dispatch(logout())
        navigate('/login')
    }} className='text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>Logout</button>
    </>
  )
}

export default Profile