import React, { useEffect } from 'react'
import  Posts from './Posts/Posts'
import { useSelector, useDispatch } from 'react-redux'
import PostForm from './PostForm'
import axios from 'axios'
import useSocket from './useSocket'
import { updateFollowPosts } from '../store/postsSlice'
function Home() {
  const posts=useSelector(state=>state.posts.followerPosts)
  const page= useSelector(state=>state.page.page)
  const email=useSelector(state=>state.auth.userData.email)
  const socket=useSocket();
  const dispatch=useDispatch();
  useEffect(()=>{
    let response;
    async function getPosts(){
      console.log(socket.id,"home socket display");
      
      response= await axios.post(`https://blogwebsite-1-wxmh.onrender.com/api/v1/posts/getposts`,{email:email, socketId:sessionStorage.getItem("socketId")},{
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },[socket])
      console.log(response.data);
      dispatch(updateFollowPosts(response.data))
    }
    if(socket)
    {getPosts()};
  },[socket])
  console.log(posts);
  return (
    <>
    <div className={ 'flex flex-col'}>
    <PostForm className={'border-gray-800 border-t-2  mt-20 bg-white rounded-lg shadow-xl'}/>
      {posts&&
       
          <Posts/>      }
    
    </div>
    </>
  )
}

export default Home