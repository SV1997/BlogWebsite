import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Reactions from './Reactions';
import Container from '../Container';
function Posts({post: {author, timestamp, post, gif,postImage, profileImage, likes, comments}}) {  // Destructuring props
    return (
        <>
            <Container className='flex h-full bg-gray-100 border-t-2 w-full border-b-2 border-black '>
                <img src={profileImage || 'default_profile.png'} alt="profile" className="m-1 w-12 h-12 rounded-full" />
                <div className="flex flex-col w-full">  {/* Flex row for the top part */}
                    <div className="flex flex-col justify-center">  {/* Column for text next to image */}
                        <h1>{author} {timestamp}</h1>
                        <h2>{post}</h2>
                    </div>
{postImage &&                    <img className='w-9/12 mt-4 ' src={postImage || 'default_post.png'} alt="post" />
}                   {gif &&                    <img className='w-9/12 mt-4 ' src={gif || 'default_post.png'} alt="post" />
}    
                 <div className='mt-4'> {/* Ensuring space for the post image */}

                        <Reactions likes={likes} comments={comments}/>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Posts