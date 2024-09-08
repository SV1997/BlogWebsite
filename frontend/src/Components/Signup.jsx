import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from './Input';
import {getAuth,createUserWithEmailAndPassword, GoogleAuthProvider,signInWithPopup } from 'firebase/auth'
import {app} from '../firebase/firebaseConfig'  
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { FaGoogle } from "react-icons/fa";
import{login as authLogin} from '../store/authSlice'
import axios from 'axios'
const auth = getAuth(app);
const googleProvider= new GoogleAuthProvider();
function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const signUpWithGoogle=async()=>{
        try{
            const res= await signInWithPopup(auth,googleProvider);
            console.log(res.user);
            const data= {name:res.user.displayName,email:res.user.email, profileImage:res.user.photoURL}
            sessionStorage.setItem('userInfo',JSON.stringify(data))
            const makeuser=await axios.post('http://localhost:3000/api/v1/user/userdata',data);
            console.log(makeuser);
            dispatch(authLogin(data))
            navigate('/post')
        }
        catch(error){
            console.log(error);
        }
    }
    const create = async (formData) => {
        setError("")
        console.log(formData);

        try {
           const res= await createUserWithEmailAndPassword(auth,formData.email,formData.password)
           console.log(res);
            const makeuser=await axios.post('http://localhost:3000/api/v1/user/userdata',formData);
            console.log(res.data);
           console.log(res); 
           navigate('/login')
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        {/* <Logo width="100%" /> */}
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("name", {
                                required: true,
                            })}
                        />
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
                        <Button type="submit" className="w-full">
                            Create Account
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

export default Signup