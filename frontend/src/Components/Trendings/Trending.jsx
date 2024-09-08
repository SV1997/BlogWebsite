import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import SearchBar from './SearchBar'
import { useSelector, useDispatch } from 'react-redux';
import { setPage } from '../../store/pageSlice';
function Trending() {
    const [trendings,setTrendings] = useState([])
    const [allNews,setAllNews] = useState([])
    const [visibleCount,setVisibleCount] = useState(3)
    const [search,setSearch] = useState([])
    const page= useSelector(state=>state.page.page);
    const apikey="6890023ea2fd396edfb059bed2c5b661"
    const url="https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey="+apikey

    useEffect(()=>{
        axios.get(url).then((response)=>{
            console.log(response.data.articles)
            setAllNews(response.data.articles)
            console.log(allNews);
            setTrendings(response.data.articles.slice(0,visibleCount))
        })
    },[])
    useEffect(()=>{
        setTrendings(allNews.slice(0,visibleCount))
    },[visibleCount])
    const increaseCount=()=>{
        setVisibleCount(visibleCount+3)
    }
  return (
    <div className=' flex flex-col mx-4 h-40 sd:mt-0 mt-10 '>
    <SearchBar searchFunction={setSearch}/>

        <div className={` md:flex flex-col max-w-7xl rounded-2xl bg-gray-200 `}>
          <h1 className='text-2xl m-2'>Trends for you</h1>
            <div className='flex flex-col'>
                {trendings.map((trending,i)=>{
                    return(
                        <div key={trending.title+i} className='border-t-2 border-b-2 border-gray-300 p-2'>
                        <div className='font-bold'>#Breakingnews</div>
                        <div className='flex flex-row m-2 border-4 border-gray-300 rounded-2xl p-2'>
                            <h2 className='m-2'>{trending.title}</h2>
                            <img src={trending.image} className='w-15 h-14'/>
                        </div>
                        </div>
                    )
                })}
          </div>
        {
          allNews.length > visibleCount ? (
            <button onClick={increaseCount} className='text-blue-600'>Show More</button>
          ) : null
        }
          
          </div> 
    </div>
  )
}

export default Trending