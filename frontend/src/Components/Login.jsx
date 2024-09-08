import React, { useState } from 'react'
import {getAuth,signInWithEmailAndPassword, GoogleAuthProvider,signInWithPopup} from 'firebase/auth'
import {app} from '../firebase/firebaseConfig'
import {useForm} from 'react-hook-form'
import Input from './Input';
import { login as authLogin } from '../store/authSlice'
import Button from './Button';
import {Link, useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { FaGoogle } from "react-icons/fa";
import axios from 'axios';
const auth= getAuth(app);
const googleProvider= new GoogleAuthProvider();

function Login() {
    console.log('login');
    const {register,handleSubmit, setValue}=useForm();
    const [error,setError]=useState('');
    const navigate=useNavigate()
    const dispatch = useDispatch()
    const signUpWithGoogle=async()=>{
        try{
            const res= await signInWithPopup(auth,googleProvider);
            // const token= res.credential.accessToken;
            let response;
            let isNewUser=false
            console.log(res.user,res._tokenResponse.isNewUser);
            if(res._tokenResponse.isNewUser){
                // isNewUser=true
                response=await axios.post('http://localhost:3000/api/v1/user/userdata',{name:res.user.displayName,email:res.user.email, profileImage:res.user.photoURL},
                    {withCredentials: true,  // Ensures that cookies, including session cookies, are sent with the request
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                console.log('new user',response.data);
            }
            else{
                response=await axios.post(`http://localhost:3000/api/v1/user/getuserdata`,{name:res.user.displayName,email:res.user.email,partial:false},{
                    withCredentials: true,  // Ensures that cookies, including session cookies, are sent with the request
                    headers: {
                        'Content-Type': 'application/json'
                    }})
                ;
                console.log('old user');
            }
            
            console.log(response.data);
            if(response.data.msg==='User not found'){
                navigate('/login')
            }
            else{
            console.log(response.data);
            const data= {name:(response.data.name?response.data.name:res.user.displayName),email:(response.data.email?response.data.email:res.user.email), profileImage:(response.data.profileImage?'http://localhost:3000/'+response.data.profileImage:res.user.photoURL), mobileNumber:response.data.mobileNumber, status:response.data.status}
            console.log(data)
            sessionStorage.setItem('userInfo',JSON.stringify(data))
            dispatch(authLogin(data))
            navigate('/post')
            }
        }
        catch(error){
            console.log(error);
        }
    }
    const login=async (data)=>{
        try{
            const res= await signInWithEmailAndPassword(auth,data.email,data.password);
            const response=await axios.post(`http://localhost:3000/api/v1/user/getuserdata`,{email:res.user.email});
            console.log(response.data);
            sessionStorage.setItem('userInfo',JSON.stringify(data))
            dispatch(authLogin(data))

            navigate('/post')
        }

        catch(error){
            let errorMessage;
            console.log(error);
            switch (error.code) {
                case 'auth/invalid-credential':
                    errorMessage = 'Incorrect email or password. Please try again.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No user found with this email. Please check your email or sign up.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This user account has been disabled.';
                    break;
                default:
                    errorMessage = 'An unknown error occurred. Please try again later.';
                    break;
            }
            setError(errorMessage)
        }
    }
  return (
    <div className='flex flex-col justify-center item-center  w-1/2'>
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
    <div className="mb-2 flex justify-center">
    <span className="inline-block w-full max-w-[100px]">
        {/* <Logo width="100%" /> */}
    </span>
</div>
<h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
<p className="mt-2 text-center text-base text-black/60">
    Don&apos;t have any account?&nbsp;
    <Link
        to="/signup"
        className="font-medium text-primary transition-all duration-200 hover:underline"
    >
        Sign Up
    </Link>
</p>
{error && <p className="text-red-600 mt-8 text-center">{error}</p>}
<form onSubmit={handleSubmit(login)} className='mt-8'>
    <div className='space-y-5'>
    <Input
                label="Email: "
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                    required: true,
                    validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
                })}
                />
                <Input
                label="Password: "
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                    required: true,
                })}
                />
    <Button
    type='submit'
    className='w-full'>
        Login
    </Button>
    </div>
    <div className='cursor-pointer mt-2 mx-2' onClick={()=>{
                        signUpWithGoogle()
                    }}>
                    <FaGoogle/>
                    </div>
</form>
</div>
</div>
  )
}

export default Login