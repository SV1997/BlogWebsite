import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import Likes from './Likes';
import Comments from './Comments';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const PostComponent = () => {
    // const posts = useSelector((state) => state.posts.allPosts);
    const navigate=useNavigate();
    const dispatch = useDispatch();
    const post=useSelector(state=>state.posts.followerPosts)
    const user=useSelector(state=>state.auth.userData);

    console.log(post);

    return (
        <div className="container mx-auto p-4">
            {post.map((post) => {
                console.log(post);
                if(post)
                {return<div className=' w-full pt-4'><div key={post.id} className="max-w-xl bg-white rounded-lg shadow-md overflow-hidden mb-4 ">
                    <div className="flex items-center p-4 hover:cursor-pointer" onClick={()=>{navigate(`/profiles`,{state:{email:post.authorId}})}}>
                        <img src={("http://localhost:3000/"+post.profile)!=="http://localhost:3000/null"?"http://localhost:3000/"+post.profile:'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'} alt="Profile" className="w-10 h-10 rounded-full mr-4" />
                        <div>
                            <h2 className="text-xl font-semibold">{post.author}</h2>
                            {

                                <p className="text-gray-500">{post.published}</p>
                            }
                            
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{post.content}</h3>
                        {post.postImage && <img src={post.postImage} alt="Post" className="w-full h-auto mb-4" />}
                        <div className="flex flex-row">
                            <Likes post={post} dblikes={post.likeNumber}><AiOutlineLike/></Likes>
                            <div className='mx-4'>
                            <Comments post={post}><FaComment /></Comments>
                        {post.comments&&post.comments.map((comment) => (
                            <div key={comment.id} className="border-t border-gray-200 py-2">
                                <p>{comment.comment}</p>
                            </div>
                        ))}
                    </div>
                        </div>
                    </div>
                    
                </div>
                </div>
}})}
        </div>
    );
};

export default PostComponent;
