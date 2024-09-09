import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import {useSelector} from 'react-redux';
import axios from 'axios';
function Comments({post, children}) {
    const [commentsShow, setCommentsShow] = useState(false);
    const {register, handleSubmit, setValue}=useForm();
    const author=useSelector(state=>state.auth.userData);
    const [comment, setComment]=useState('');
    const [comments, setComments]=useState([]);
    console.log(author);
    useEffect(()=>{
      async function getComments(){
        const commentsData= await axios.post(`https://blogwebsite-1-wxmh.onrender.com/api/v1/posts/getcomments`,{postId:post.id}); 
        console.log(commentsData.data);
        setComments(commentsData.data);
      }
      getComments();
    },[])
    const commentSubmitHandler=async (data)=>{
        console.log(data);
        setComment('');
        const date=String(getDate());
        setComments([...comments, {content:data.comment, author:author.name, profile:author.profileImage, published:date}]);
        const commentPost= await axios.post('https://blogwebsite-1-wxmh.onrender.com/api/v1/posts/addcomments',{postId:post.id, comment:data.comment,authorId:author.email, published:date});
        console.log(commentPost);   
    }
  return (
    <div><h4 onClick={()=>{
        setCommentsShow(!commentsShow);
    }}className="text-md font-semibold mb-2">{children}</h4>
    {commentsShow&&<div>
        <form onSubmit={handleSubmit(commentSubmitHandler)}>
            <input value={comment} onChange={(e)=>{
              setValue('comment', e.target.value);
              setComment(e.target.value);
            }} placeholder='enter your thoughts here' type="text" />
            <button type='submit'>send</button>
            </form>
            <div>
            {
              comments.map((comment)=>{
                return (
                  <div className='flex flex-row' key={comment.id}>
                    <div className='w-1/6'>
                      <img src={comment.profile!=="https://blogwebsite-1-wxmh.onrender.com/null"?comment.profile: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'} alt="profile image" className='w-4/6 rounded-full' />
                    </div>
                    <div className='flex flex-col'>
                      <p className='text-xs'>{comment.author} <span>{comment.published}</span></p>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                );
              })
            }
            </div>
            
            </div>}
    </div>
  )
}

export default Comments

function getDate(){
  const now= new Date(Date.now());
  let day = now.getDate();
  let month= now.getMonth();
  let year= now.getFullYear()%100
  let hours= now.getHours();
  let minutes= now.getMinutes();
  day=day<10?`0${day}`:day;
  month=month<10?`0${month}`:month;
  year=year<10?`0${year}`:year;
  hours=hours<10?`0${hours}`:hours;
  minutes=minutes<10?`0${minutes}`:minutes;
  const date=`${day}/${month}/${year} ${hours}:${minutes}`
  return date;
}