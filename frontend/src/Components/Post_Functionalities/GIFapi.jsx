import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import SearchBar from '../Trendings/SearchBar'
import { MdCancel } from "react-icons/md";
import { set } from 'react-hook-form';
function GIFapi({ setSelectedGIF,setValue ,children, ...props }) {
  const [gifs, setGifs] = useState([])
  const [showTable, setShowTable] = useState(false);
  const [search, setSearch] = useState('')
  useEffect(() => {
    async function fetchGIFs() {
      try {
        const response = await axios.get('https://pixabay.com/api/', {
          params: {
            key: '44743503-8c62e8da01c1d4f90c68db391',
            q: search,
            image_type: 'photo',
          }
        })
        setGifs(response.data.hits)
      } catch (err) {
        throw new Error(err)
      }
    }
    fetchGIFs()
  },[search])
  function handleButtonClick() {
    setShowTable(!showTable)
  }
  function handleSubmitGIF(gif) {
    setValue('gif', gif.webformatURL)
    setSelectedGIF(gif.webformatURL)
    setShowTable(false)
  }
  return (
    <div >
      <label className='flex mt-4 mx-2' onClick={()=>{
        setShowTable(!showTable)
      
      }}>{children}</label>
    {showTable && (<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
    <div className='w-3/4 h-3/4 relative border border-black rounded p-4 bg-white overflow-auto'>
      <button onClick={handleButtonClick}><MdCancel />      </button>
      <div>
        <SearchBar searchFunction={setSearch}/>
        
          <div className='flex flex-wrap overflow-auto' style={{ maxHeight: '80%' }}>
            {gifs.map((gif, index) => (
              <div key={index} className='w-1/3 p-1 box-border'>
                <label htmlFor={gif.webformatURL}>
                  <img className='w-full h-full object-cover' src={gif.webformatURL} alt={`GIF ${index + 1}`} {...props} />
                </label>
                <input style={{ display: 'none' }} id={gif.webformatURL} type="radio" name="gif" onClick={() => handleSubmitGIF(gif)} {...props}/>
              </div>
            ))}
          </div>
      </div>
    </div>
  </div>
          )}

  </div>
  );
}

export default GIFapi