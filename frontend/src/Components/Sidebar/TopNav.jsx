import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Post from './Post'
function TopNav() {
  const authStatus= useSelector(state=>state.auth.status)
  const navigate= useNavigate();
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
  return (
    <>
    <div className='fixed top-0 left-0 h-full w-64 bg-gray-100 p-5 flex flex-col'>
    {/* <Logo/> */}
    <nav className='flex'>
      <ul className='flex flex-col ml-auto'>
   {navItem.map((item,index)=>{
return item.active?(<>
<li key={item.name}><button 
className='text-2xl bg-transparent text-black font-semibold hover:text-gray-700 hover:border-gray-500 hover:bg-gray-500 rounded-2xl w-full text-left px-3 py-2'
onClick={()=>navigate(item.slug)}
>{item.name}</button></li>
</>):null
})}
<li>
  <Post/>
</li>
</ul>
    </nav>
    </div>

    </>
  )
}

export default TopNav