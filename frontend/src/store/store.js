import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import postSlice from "./postsSlice";
import pageSlice from "./pageSlice";
import notificationslice from "./notificationSlice";
const store= configureStore({
    reducer: {
        auth:authSlice,
        posts:postSlice,
        page:pageSlice,
        notification:notificationslice
    }
})

export default store