import React, { useContext, useEffect, useState } from 'react';
import Posts from './Posts/Posts';
import { useSelector, useDispatch } from 'react-redux';
import PostForm from './PostForm';
import axios from 'axios';
import { updateFollowPosts } from '../store/postsSlice';
import SocketContext from './SocketContext';

function Home() {
  const posts = useSelector((state) => state.posts.followerPosts);
  const email = useSelector((state) => state.auth.userData.email);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();

  const [socketConnected, setSocketConnected] = useState(false);

  // Listen for socket connection
  useEffect(() => {
    if (socket) {
      // If socket is already connected
      if (socket.connected) {
        console.log('Socket is already connected:', socket.id);
        setSocketConnected(true);
        getPosts(socket.id);
      } else {
        // Listen for the 'connect' event
        const onConnect = () => {
          console.log('Socket connected:', socket.id);
          setSocketConnected(true);
          getPosts(socket.id);
        };

        socket.on('connect', onConnect);

        // Cleanup the event listener on unmount
        return () => {
          socket.off('connect', onConnect);
        };
      }
    }
  }, [socket]);

  // Function to get posts
  async function getPosts(socketId) {
    console.log('Fetching posts with socket ID:', socketId);

    try {
      const response = await axios.post(
        'https://blogwebsite-1-wxmh.onrender.com/api/v1/posts/getposts',
        {
          email: email,
          socketId: socketId,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Posts data:', response.data);
      dispatch(updateFollowPosts(response.data));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <PostForm className="border-gray-800 border-t-2 mt-20 bg-white rounded-lg shadow-xl" />
        {posts && <Posts />}
      </div>
    </>
  );
}

export default Home;
