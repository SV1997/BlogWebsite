import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
function SearchBar({searchFunction}) {
    const [search,setSearch] = useState('')
    const [searchResult,setSearchResult]=useState([])
    const navigate=useNavigate();
    useEffect(() => {

            const timeOut=setTimeout(async()=>{
                let response;
                try {
                 response=await axios.get(`http://localhost:3000/api/v1/user/search/${search}`)
                } catch (error) {
                    console.log(error);
                    response=
                    {
                        data:[],
                        error:error
                    }
                }
                setSearchResult(response.data)
                console.log(response.error);
            },1000)
            return ()=>clearInterval(timeOut)
        
    },[search])
  return (
    <form className="max-w-[480px] w-full px-4">
    <div className={`relative pb-2  mt-4 w-full ${searchResult.length>0?'rounded-lg':'rounded-full' } border dark:text-gray-800 mb-8 dark:border-gray-700 dark:bg-gray-200`}>
        <input type="text" name="q" value={search} onChange={(e)=>{
            setSearch(e.target.value)
        }} className=" mx-4 border-none mt-2 bg-transparent focus:outline-none" placeholder="search"/>
        <button type="submit" onClick={(e)=>{
            e.preventDefault()
            searchFunction(search)
        }}>
            <svg className="black-400 h-5 w-5 absolute top-2 right-3 fill-current black"
                xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"
                x="0px" y="0px" viewBox="0 0 56.966 56.966"
                style={{enablebackground:"new 0 0 56.966 56.966"}} xmlSpace="preserve">
                <path
                    d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z">
                </path>
            </svg>
        </button>
        {console.log(searchResult)}
        {searchResult.length>0&&<div className='mx-2'>
            <ul>
            {searchResult.map((user)=>{
                        {console.log(user)}
                return <li onClick={()=>{
                    setSearch('')
                    setSearchResult([])
                    console.log(user.email);
                    navigate(`/profiles`,{state:{email:user.email}})
                }} className='border-t-2 border-gray-100 hover:bg-gray-300 cursor-pointer'>
                    <img className='w-4/6 rounded-full' src={'https://localhost:3000/'+user.profileImage} alt="" />
                    <p>{user.name}</p>
                </li>
            })}</ul></div>}
    </div>
</form>
  )
}

export default SearchBar