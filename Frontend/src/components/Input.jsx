import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,  //label = "Email"
    type = "text",
    className = "",
    ...props
  }, ref){

    const id = useId(); 

return(
       <div className='w-full'>
            {label && <label 
            className='inline-block mb-1 pl-1' 
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            ref={ref}  
            type={type}
            className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input


// label nahi hai (falsy)
// label = ""
// // ya undefined / null

// 👉 Result:

// nothing (null)

// ✔ kuch bhi render nahi hoga
// ✔ error bhi nahi aayega
// ✔ input normally render hoga


// another way to write the label code
// { label ? <label>{label}</label> : <span>No label</span> }