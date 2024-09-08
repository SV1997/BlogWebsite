import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
function Profiles() {
    const location = useLocation();
    const emailinitial=(location.state.email);
    console.log(emailinitial);
    const [email,setEmail]=useState(emailinitial);
    const senderEmail= useSelector(state=>state.auth.userData.email);
    const [requestState,setRequestState]=useState("");
    const [secondaryConfirmation, setSecondaryConfirmation]=useState("");
    const [userData,setUserData]=useState({});
    let confirmCase=false
    const navigate=useNavigate();
    console.log(senderEmail);
    useEffect(() => {
        console.log(email);
        setEmail(location.state.email);
    },[email,location])
    const sendRequest=async()=>{
        console.log("Send Request");
        
        const response=await axios.post(`https://shark-app-ahkas.ondigitalocean.app/api/v1/user/sendrequest`,{email:email, senderEmail:senderEmail, socketId:sessionStorage.getItem('socketId')},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response.data);
    }
    useEffect(() => { 
       async function getUserData(){
            const response=await axios.post(`https://shark-app-ahkas.ondigitalocean.app/api/v1/user/getuserdata`,{email:email,partial:true},            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            if(response.data.following && response.data.followed){
                setRequestState("following");
            }
           else if(response.data.requestRecieved){
                console.log("Request Recieved");
                if(!response.data.followed){confirmCase=true;}
                setRequestState("Confirm");
            }
            else if(response.data.requestSent){
                setRequestState("Requested");
            }
            else if(response.data.following && !response.data.followed){
                setRequestState("follow back");
            } 
            else{
                setRequestState("Follow");
            }
            console.log(response.data.follow && !response.data.followed);
            if(response.data.followed&&response.data.requestRecieved){
                setSecondaryConfirmation("Confirm");
                }
            setUserData(response.data);
        }
        getUserData();
    },[email,location])
    const confirmRequest=async()=>{
        const response=await axios.post(`https://shark-app-ahkas.ondigitalocean.app/api/v1/user/confirmrequest`,{email:email},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response.data);
    }
    const withdrawRequest=async()=>{
        const response=await axios.post(`https://shark-app-ahkas.ondigitalocean.app/api/v1/user/withdrawrequest`,{email:email},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response.data);
    }
    const unfollow=async()=>{
        const response=await axios.post(`https://shark-app-ahkas.ondigitalocean.app/api/v1/user/unfollow`,{email:email},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response.data);
    }
    const message=async()=>{
        const chatCreated=await axios.post(`https://shark-app-ahkas.ondigitalocean.app/api/v1/messages/createChatId`,{email:email},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const createContacts=await axios.post(`https://shark-app-ahkas.ondigitalocean.app/api/v1/messages/setcontacts`,{email:email, name:userData.name},{
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        navigate('/message',{state:{email:email, name:userData.name}});
        console.log(chatCreated.data);  
    console.log(createContacts.data);  }
  return (
<div className="flex flex-col items-center p-4 bg-white shadow rounded-lg">
    <img className="rounded-full w-32 border-4 border-gray-300" src={'https://shark-app-ahkas.ondigitalocean.app/' + userData.profileImage} alt="Profile" />
    <p className="mt-4 text-sm text-gray-500">Name</p>
    <p className="text-lg font-semibold">{userData.name}</p>
    <p className="mt-4 text-sm text-gray-500">Status</p>
    <p className="text-gray-700">{userData.status}</p>
    <p className="mt-4 text-sm text-gray-500">Email</p>
    <p className="text-gray-600">{userData.email}</p>
{ requestState!==""&&<button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300" onClick={()=>{
        if(requestState==="Follow" || requestState==="follow back")
            {sendRequest();
                setRequestState("Requested");
                console.log("Request Sent");
                
            }
        else if(requestState==="Confirm"){
            if(confirmCase){
                setRequestState("follow back");
                confirmRequest();
            }
            else
            {   setRequestState("following");
                confirmRequest();}
        }
        else if(requestState==="Requested")
            {
               setRequestState("Follow");
                withdrawRequest();
            }
        else if(requestState==="following")
            {
                setRequestState("Follow");
                unfollow();}
    }}>{requestState}</button>}
{    console.log(requestState==="following"&&secondaryConfirmation==="Confirm")}    
    {(requestState==="followed"&&secondaryConfirmation==="Confirm")&&<button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300" onClick={()=>{confirmRequest()}}>Confirm</button>}
{(requestState==="following"||requestState==="follow back")&&<button onClick={()=>{
    message();
    
}} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">Message</button>}
</div>
  )
}

export default Profiles