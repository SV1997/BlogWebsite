import React from 'react'
import { useState } from 'react';
function Input({
    className,children, showTable ,...props
}) {
  return (
    <div><input type='file' id={`postinput`}  style={{display:'none'}} {...props}/>
    <label htmlFor={`postinput`} className={`inline-block cursor-pointer ${className}`}>{children}
</label></div>
  )
}

export default Input