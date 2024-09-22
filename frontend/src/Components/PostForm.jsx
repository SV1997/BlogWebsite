import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Input from './InputFile';
import { GoFileMedia } from "react-icons/go";
import { MdOutlineGifBox } from "react-icons/md";
import { FaPoll } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { freshFeed,newUpload, updateFollowPosts} from '../store/postsSlice';
import Emoji from './Post_Functionalities/Emoji';
import Location from './Post_Functionalities/Location';
import GIFapi from './Post_Functionalities/GIFapi';
import axios from 'axios';
function PostForm({className}) {
  const [postText,setPostText] = useState('');
  const[GIF,setGIF] = useState('');
  const [emoji, setEmoji] = useState('');
  const [location,setLocation]=useState('');
    const {register, handleSubmit, setValue} = useForm();
    const dispatch = useDispatch();
    let profileImage = useSelector(state => state.auth.userData.profileImage);
    profileImage = profileImage ? profileImage : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png';
    const name = useSelector(state => state.auth.userData.email);
    const handleEditorChange = async(data) => {
       const res = await axios.post('https://blogwebsite-1-wxmh.onrender.com/api/v1/posts/newpost',{author:JSON.parse(sessionStorage.getItem('userInfo')).email,comments:[],...data});
       console.log(res.data);
      dispatch(newUpload({author:name,profileImage:profileImage,...data}));
        dispatch(freshFeed({author:name,profileImage:profileImage,...data}));
        dispatch(updateFollowPosts({author:name,profileImage:profileImage,...data}));
    }
    console.log(profileImage);
    useEffect(() => {
      console.log(emoji);
      setPostText((prev)=>{
        return prev + emoji
      })
      setValue('post',postText+emoji);
    },[emoji])
    const inputText=(e)=>{
      setPostText(e.target.value);
      setValue('post',e.target.value);
    }
  return (
    <div className={`mb-200  h-1/2 p-10 ${className}`}>
    <form className='flex flex-col' onSubmit={handleSubmit(handleEditorChange)}>
      <div className='flex flex-row'>
        <img style={{width: '10%', height: '70%'}} className='rounded-full mt-2' src={profileImage} alt="profile" />
        <input
          className='ml-4 w-3/4 focus:outline-none'
          type="text"
          {...register("content")}
          value={postText}
          placeholder='What is Happening'
          onChange={(e) => inputText(e)}
        />
      </div>
      <div className='flex flex-col w-full mt-8 border-t-2' style={{ minHeight: '20px' }}>
        <div className='flex flex-row mb-4'>
          <Input {...register("image")} type='file' className={'mx-2 mt-4'}><GoFileMedia/></Input>
          <GIFapi {...register("gif")} setValue={setValue} setSelectedGIF={setGIF} className={'mx-2 mt-4'}><MdOutlineGifBox /></GIFapi>
          <Input {...register("poll")} className={'mx-2 mt-4'}><FaPoll /></Input>
          <Emoji register={register} setEmojis={setEmoji} fieldName='emoji'><MdOutlineEmojiEmotions /></Emoji>
          <Location {...register("location")} setRealLocation={setLocation} setValue={setValue}><FaLocationDot /></Location>
        </div>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-xs sd:text-base text-white font-bold py-4 mx-1/4 px-3 rounded-3xl w-1/4 sd:self-end mt-auto'
        >
          Post
        </button>
        {console.log(location)}
        {location !== '' && <p className='self-center mt-10'>{location}</p>}
        {GIF !== '' && <img className='self-center mt-10' src={GIF} alt="Selected GIF" />}

      </div>
    </form>
  </div>
  )
}

export default PostForm