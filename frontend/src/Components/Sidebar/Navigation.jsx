import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Post from './Post'
import { useRef } from 'react'
import PostForm from '../PostForm'
import { MdCancel } from "react-icons/md";
import { nanoid } from 'nanoid'
import socket from '../socket'
import { setNotification } from '../../store/notificationSlice'
function Navigation() {
  const notification= useSelector(state=>state.notification.notification)
  const dispatch= useDispatch()
  const [newrequest, setNewrequest] = useState(0)
  useEffect(()=>{
    console.log(socket);
    
    socket.on('notificationUpdate',(message)=>{console.log('connected')
      console.log(message);
      setNewrequest(newrequest+1)
      dispatch(setNotification(message))
    },[socket,dispatch])
 return ()=>socket.disconnect();
  },[])
  const authStatus= useSelector(state=>state.auth.status)
  const navigate= useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [showPost,setShowpost]=useState(false)
  const ref= useRef(null)
  // const ref2= useRef(null)
  const navItem=[{
    name: 'Home',
    slug: '/',
    active: true
  },
{
  name: 'Explore',
  slug: '/explore',
  active: true
},
{
  name: 'Notification',
  slug: '/notification',
  active: true
},
{
  name: 'Messages',
  slug: '/message',
  active: true
},{
  name: 'Profile',
  slug:'/profile',
  active: true
},
]
function handlesidebarclosing(event){
  if(ref.current&& !ref.current.contains(event.target)){
    console.log(ref.current.contains(event.target));
    setSidebarOpen(false)

  }
}
useEffect(()=>{
  console.log('useEffect');
  document.addEventListener('click',handlesidebarclosing)
  return ()=>{
    document.removeEventListener('click',handlesidebarclosing)
  }
},[isSidebarOpen])
  return (
    <>
    <div ref={ref}>
   <button onClick={()=>{
    setSidebarOpen(true)
   }} data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sd:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 z-10">
   <span className="sr-only">Open sidebar</span>
   <svg className="w-6 h-6"  fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
   <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
   </svg>
</button>
    <aside  id="sidebar-multi-level-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen?'translate-x-0': '-translate-x-full'} sd:translate-x-0 `}>
      <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'>
    {/* <Logo/> */}
    <ul className="space-y-2 font-medium">
   {navItem.map((item,index)=>{
return item.active?(<>
<li key={item.name}><button 
className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
onClick={()=>navigate(item.slug)}
>{item.name}</button>{console.log(newrequest,"newrequest",(item.name==="Notification"&&(newrequest>0)))}{(item.name==="Notification"&&(newrequest>0))&&<div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">{newrequest}</div>}</li>
</>):null
})}
<li >
  <Post onClick={()=>{
    setShowpost((prev=>!prev))
  }}/>
</li>
</ul>
    </div>
    </aside>

    </div>
    {showPost && (
  <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 backdrop-blur-md z-50">
    <div className="bg-white w-1/2 h-1/2 p-6 rounded-lg shadow-lg ">
    <MdCancel onClick={()=>{
      setShowpost(false)
    }} className='cursor-pointer'/>
      <PostForm className={'relative b-10 '}/>
    </div>
  </div>
)}
    </>
  )
}

export default Navigation