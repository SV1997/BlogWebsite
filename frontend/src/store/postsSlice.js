import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

const initialState = {
    uploadedPosts:[],
    allPosts:[],
    followerPosts:[]
}

const postSlice= createSlice({
    name: "post",
    initialState,
    reducers:{
        newUpload:(state,action)=>{
            console.log(action.payload);
            const newPost=action.payload ;
            state.uploadedPosts.push(newPost)
        },
        addLikes:(state,action)=>{
            console.log(action.payload);
            console.log(state.allPosts);
            const {id,likes}=action.payload;
            const post=state.allPosts.find((post)=>post.id===id);
            if(post){
                console.log(post.likes);
                post.likes+=1;
                console.log(post.likes);
            }
        },
        freshFeed:(state,action)=>{
            const freshFeed= action.payload;
            console.log(freshFeed);
            state.allPosts.push(freshFeed);
            console.log(freshFeed);
        },
        updateFollowPosts:(state,action)=>{
            console.log(action.payload);
            console.log(state.followerPosts);
            
            action.payload.forEach((newPost)=>{
                const postPresent= state.followerPosts.some((post)=>post.id===newPost.id);
                if(postPresent){
                    console.log(postPresent, newPost);
                    
                    return;
                }
                state.followerPosts.push(newPost);
            })
            console.log(state.followerPosts);
            
        },
        postsLogout:(state,action)=>{
            state.uploadedPosts=[];
            state.allPosts=[];
            state.followerPosts=[];
            console.log("cleared");
            
        }
    }
})
export const {newUpload,freshFeed,addLikes, updateFollowPosts,postsLogout}=postSlice.actions
export default postSlice.reducer