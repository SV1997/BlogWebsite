import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState={
    status:false,
    userData:{}
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        login:(state,action)=>{
            state.status= true;
            const profileImage = 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png';
            state.userData={profileImage:profileImage,...action.payload}
            console.log(action.payload);
        },
        updateUserData:(state,action)=>{
            state.userData= {...state.userData,...action.payload.userData};
        },
        logout:(state)=>{
            state.status= false;
            state.userData= {};

                
        }
    }
})

export const {login,logout}= authSlice.actions;
export default authSlice.reducer