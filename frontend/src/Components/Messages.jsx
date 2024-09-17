import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import axios from "axios";
import useSocket from "./useSocket";
function Messages() {
    const location=useLocation();
    const [contact, setContact] = useState({email:location.state?.email, name:location.state?.name});
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState();
    const [currentMessage, setCurrentMessage] = useState([]);
    const [dynamicMessage, setDynamicMessage] = useState('');
    const [currentContact, setCurrentContact] = useState();
    const socket=useSocket();
    // const [newMessage, setNewMessage] = useState('');
    const email= useSelector(state=>state.auth.userData.email);
    const { register, handleSubmit,setValue } = useForm();
    useEffect(()=>{
        console.log('socket');
        if(socket)
{        socket.on('message',(message)=>{console.log('connected')
          console.log(message);
          if(message!=='room joined'){const newCurrentMessage=[...currentMessage,{message:message.message, email:contact.email}]
          setCurrentMessage(newCurrentMessage);}
        },)}
     return ()=>{if(socket){socket.disconnect()}};
      },[socket])
    useEffect(() => {
        const fetchContacts = async () => {
            const response = await axios.get("https://blogwebsite-1-wxmh.onrender.com/api/v1/messages/getcontacts", {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setContacts(response.data);
            console.log(response.data);
        };
    fetchContacts()},[])
    async function fetchMessages(){
        console.log(contact);
        setCurrentContact(contact.email);
        try {const response = await axios.post("https://blogwebsite-1-wxmh.onrender.com/api/v1/messages/getmessages", { user:email,reciever:contact.email }, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        })
        setMessages(response.data);
        console.log(response.data);
    }
        catch (error){
            console.log(error);
            
        }

                
    }
    useEffect(()=>{
    if(contact.email){
        fetchMessages();
    }},[contact])

    async function sendMessage(data){
        console.log(data.message, email);
        const update=[...currentMessage,{message:data.message, email:email}]
        setCurrentMessage(update);
        const response= await axios.post("https://blogwebsite-1-wxmh.onrender.com/api/v1/messages/sendmessage",{author:email, message:data.message, messageId:messages.messageId, friend:contact.email},{withCredentials:true,headers:{"Content-Type":"application/json"}});
        console.log(response.data);
        setDynamicMessage('');
    }
    function dateTime() {
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
        const year = now.getFullYear().toString().substr(-2); // Get last two digits of the year
    
        return `${day} ${month} ${year}`;
    }
    function formatDateTime(isoString) {
        const date = new Date(isoString);
    
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear().toString().substr(-2); // Get last two digits of the year
    
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }
    
return (
    <div className="bg-gray-100">
        <div className="flex h-screen">
            {/* <!-- Contacts Sidebar --> */}
            <div className="w-1/4 bg-white overflow-auto">
                {contacts.map((contact) => {
                    console.log(contact,"contactMessage");
                    
                    return (
                        <div className="flex flex-col">
                            {/* <!-- Each contact --> */}
                            <div
                                onClick={() => {

                                
                                    setContact({email:contact.email,name:contact.name});
                                    fetchMessages(contact.id);
                                }}
                                className="p-4 hover:bg-gray-200 cursor-pointer"
                            >
                                {contact.name}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* <!-- Messages Area --> */}
            <div className="flex-1 flex flex-col bg-gray-50">
                {contact.name ? (
                    <>
                        <div className="overflow-auto p-4">
                            {console.log(messages)}
                            {messages&&messages.messageContent.map((message) => {
                                return (
                                    <>
                                        {message.authorId === contact.email && (
                                           
                                             <><div className="bg-green-100 max-w-md mr-auto p-4 rounded-lg my-2 text-left">
                                             {/* meassage from sender */}
                                             {message.content}

                                         </div>
                                         <div className="text-sm text-gray-600 text-left">
                                             {formatDateTime(message.createdAt)}
                                         </div></>
                                        )}
                                        {message.authorId !== contact.email && (
                                            <><div className="bg-blue-100 max-w-md ml-auto p-4 rounded-lg my-2 text-right">
                                            {/* meassage from user */}
                                            {message.content}
                                            
                                        </div>
                                        <div className="text-sm text-gray-600 text-right">
                                            {formatDateTime(message.createdAt)}
                                        </div>
                                        </>
                                        )}
                                    </>
                                );
                            })}
                            <>
                                            {currentMessage.map((messageContent)=>{
                                                console.log(messageContent);
                                                
                                                return messageContent.email===contact.email?
                                            <div className="bg-green-100 max-w-md mr-auto p-4 rounded-lg my-2 text-left">
                                            {/* meassage from sender */}
                                            {messageContent.message}
                                            <div className="text-sm text-gray-600">
                                            {dateTime()}
                                        </div>
                                        </div>
                                            :
                                            <div className="bg-blue-100 max-w-md ml-auto p-4 rounded-lg my-2 text-right">
                                                {/* meassage from user */}
                                                {messageContent.message}
                                                <div className="text-sm text-gray-600">
                                                {dateTime()}
                                            </div>
                                            </div>
                                            })}
                                        
                                    </>
                            {/* <!-- Add more messages as needed --> */}
                        </div>
                        {/* <!-- Message Input --> */}
                        <form onSubmit={handleSubmit(sendMessage)}>
                        <div className="mb-4 mx-4">
                           
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="w-full p-4 rounded-lg focus:outline-none shadow"
                                value={dynamicMessage}
                                onChange={(e)=>{console.log(e.target.value);
                                    setValue('message',e.target.value);
                                    setDynamicMessage(e.target.value)}}
                                
                            />
                        </div>
                        <button type='submit' className="bg-green-500 text-white px-4 py-2 rounded-lg" >Send</button>
                        </form>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">Select any contact to chat</div>
                )}
            </div>
        </div>
    </div>
);
}

export default Messages