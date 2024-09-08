import React, { useEffect } from 'react'
import  Posts from './Posts/Posts'
import { useSelector, useDispatch } from 'react-redux'
import PostForm from './PostForm'
import axios from 'axios'
import { updateFollowPosts } from '../store/postsSlice'
function Home() {
  const posts=useSelector(state=>state.posts.followerPosts)
  const page= useSelector(state=>state.page.page)
  const email=useSelector(state=>state.auth.userData.email)
  const dispatch=useDispatch();
  useEffect(()=>{
    let response;
    async function getPosts(){
      response= await axios.post(`https://shark-app-ahkas.ondigitalocean.app/api/v1/posts/getposts`,{email:email, socketId:sessionStorage.getItem('socketId')},{
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log(response.data);
      dispatch(updateFollowPosts(response.data))
    }
    getPosts();
  },[])
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