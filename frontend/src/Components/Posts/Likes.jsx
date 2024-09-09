import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
import { addLikes } from '../../store/postsSlice';
import axios from 'axios';
function Likes({post,dblikes ,children}) {
  console.log(dblikes,"likes")
  const dispatch = useDispatch();
  const user=useSelector(state=>state.auth.userData);
  const [likes,setLikes]=useState(dblikes);
  const handleLike = async(post) => {
    console.log(post);
    
    dispatch(addLikes({ id:post.id, likes:(post.likes+1)  }));
    const response= await axios.post('https://blogwebsite-1-wxmh.onrender.com/api/v1/posts/addlikes', {id:post.id, liker:user.email});
    console.log(response.data.likes);
    if(response.data.likes!==undefined){
        setLikes(likes+1)
    }
    
};
  return (
    <div onClick={()=>{handleLike(post);
    }} className="text-blue-500 hover:text-blue-700 flex flex-row cursor-pointer">{children}{likes}
                            </div>
  )
}

export default Likes