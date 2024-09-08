import React from 'react'
import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
function Emoji({children,register,fieldName,setEmojis,...props}) {
    const[emoji,setEmoji]=useState('')
    const [showTable, setShowTable] = useState(false);
    const recordEmoji = (emoji) => {
      console.log(emoji.emoji);
      setEmojis(emoji.emoji)
          setShowTable(false)
        setEmoji(emoji.emoji)
    }
  return (
    <div>
      <label className='flex mt-4 mx-2' onClick={()=>{
        console.log(showTable);
        setShowTable(!showTable)
      }}>{children}</label>
        <input {...register(fieldName)} type="text" value={emoji} {...props} style={{display:'none'}}/>
        { showTable &&
        <div className='fixed inset-0 flex items-center justify-center z-50' >

        <EmojiPicker onEmojiClick={(emoji)=>{
          recordEmoji(emoji)
    }}/></div>}</div>
  )
}

export default Emoji