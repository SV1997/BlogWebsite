import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { useEffect,useState } from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {app} from '../firebase/firebaseConfig'
import {login,logout} from '../store/authSlice'
import { useLocation } from 'react-router-dom'
import {login as authLogin} from '../store/authSlice'
import axios from 'axios'
const auth= getAuth(app);
function AuthLayout({children, authentication = true}) {
    const location= useLocation();
    const isLogin= location.pathname==='/login' 
    const navigate = useNavigate()
    const status = useSelector(state => state.auth.status)
    const [loader,setLoader]=useState(true);
    const dispatch=useDispatch()
    const userInfo= useSelector(state=>state.auth.userData)
    useEffect(() => {
        const unsubscribe= onAuthStateChanged(auth,async userData=>{
            console.log(userData);
            if(authentication&&(!userData)==authentication){
                 navigate('/login')

            }
            else if(!authentication&&(!userData)==authentication){
                navigate('/post')
            }
            console.log(userInfo);
            if(!(userInfo&&userInfo.email)&&userData){
                const response=await axios.post(`https://shark-app-ahkas.ondigitalocean.app/api/v1/user/getuserdata`,{email:userData.email},
                    {
                        withCredentials: true,  // Ensures that cookies, including session cookies, are sent with the request
                        headers: {
                            'Content-Type': 'application/json'
                        }}
                );
                console.log("getdata active ")
                console.log(response.data);
                const data= {name:(userInfo.name?response.data.name:userData.displayName),email:(userInfo.email?response.data.email:userData.email), profileImage:((response.data&&response.data.profileImage)?'https://shark-app-ahkas.ondigitalocean.app/'+response.data.profileImage:userData.photoURL), mobileNumber:response.data?response.data.mobileNumber:'', status:response.data?response.data.status:''}
                console.log(data)
                sessionStorage.setItem('userInfo',JSON.stringify(data))
                dispatch(authLogin(data))
                navigate('/post')
            const item= JSON.parse(sessionStorage.getItem('userInfo'));
            console.log(item)
            if(item===null){
                console.log('item is null');
                sessionStorage.setItem('userInfo', JSON.stringify(data))
                dispatch(login(data))
            }
            else{
                dispatch(login(item))
            }
        }
            setLoader(false);
        })

        return ()=>{
            unsubscribe()
        }

    }, [status, navigate])
  return loader? <>Loading...</>:<>{children}</>
}

export default AuthLayout