import React from 'react'
import { Link } from 'react-router-dom'
function post({onClick}) {
  return (
    <button onClick={onClick} className='text-2xl bg-blue-500 hover:bg-blue-700 text-white font-bold my-3 py-4 px-3 rounded-3xl w-full'>Post</button>
  )
}

export default post