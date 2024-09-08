import React,{useState} from 'react'
import { FaRegComment } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import Comment from './Comment';
function Reactions({likes,comments}) {
  const [commentsShow, setCommentsShow] = useState(false);
  return (
    <div>
        <div className='flex'>
            <button className='flex mr-7'>
            <CiHeart className='ml-2 mt-1.5  hover:bg-blue-100'/>
            {likes}
            </button>
            <button className='flex mr-7'>
            <FaRegComment onClick={()=>{
              console.log('show comment',commentsShow);
              setCommentsShow(!commentsShow)
            }} className='mt-1.5'/>
            {commentsShow&&<Comment comment={comments}/>}
            </button>
        </div>
    </div>
  )
}

export default Reactions