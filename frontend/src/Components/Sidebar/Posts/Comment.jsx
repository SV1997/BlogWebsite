import React from 'react'

function Comment({comment}) {
  return (
    <>
    {comment.map(()=>{<div>{comment}</div>})}
    </>
  )
}

export default Comment