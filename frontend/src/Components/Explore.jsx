import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Posts from './Posts/Posts';
import {useSelector,useDispatch} from 'react-redux';
import { freshFeed } from '../store/postsSlice';
const Explore = () => {
    const [posts,setPosts]=useState([]);
    const dispatch=useDispatch();
    useEffect(()=>{
        async  function  getAllPosts(){
            const post= await axios.get('http://localhost:3000/api/v1/posts/getallposts');
            console.log(posts.data);
            setPosts(post.data);
            post.data.map((post1) =>{
                console.log(post1);
            dispatch(freshFeed(post1));
            })
        }
        getAllPosts();
        console.log(posts);
    },[])
    return (
        <div>
            {
          console.log(posts )}
          <Posts post = {posts}/>

        </div> 
    );
};

export default Explore;