import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { setPage } from '../store/pageSlice';
function ResponsiveButtons() {
    const [width,setWidth]=useState(window.innerWidth);
    const navigate= useNavigate();
    const dispatch= useDispatch();
    const page =useSelector((state)=>state.page.page)
    useEffect( ()=>{function handleResize(){
        console.log(window.innerWidth);
        setWidth(window.innerWidth)
    }
    window.addEventListener('resize',handleResize)
    return()=>(window.removeEventListener('resize',handleResize))
},[])
    useEffect(()=>{
        console.log('width');
        if(width>1200&&page==='trending'){
        navigate('/post')
        }
    },[width,navigate])
    function handlePageChange(page){
        if(width<1200){
            // console.log('1200',width);
        dispatch(setPage(page));
        navigate('/'+page)
        return
        }
        
    }
  return (
    <div className='relative top-10 mt-10 flex flex-row justify-center z-10 md:hidden'>
        <button onClick={()=>{handlePageChange('post')}} className='mx-10'>
            Posts
        </button>
        <div className='border-r-2'></div>
        <button  className='mx-10' onClick={()=>{handlePageChange('trending')}}>
            Trending
        </button>
    </div>
  )
}

export default ResponsiveButtons