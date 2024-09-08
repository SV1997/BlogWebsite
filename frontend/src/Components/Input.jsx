import { input } from '@material-tailwind/react'
import React, {useId} from 'react'
import {useState} from 'react'
const Input = React.forwardRef( function Input({
    label,
    type = "text",
    className = "",
    placeholder,
    onChange,
    value,
    ...props
}, ref){
    const id = useId()
    const [inputValue, setInputValue] = useState(value)
    return (
        <div className='w-full'>
            {label && <label 
            className='inline-block mb-1 pl-1' 
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
            ref={ref}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e)=>{setInputValue(e.target.value)}}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input