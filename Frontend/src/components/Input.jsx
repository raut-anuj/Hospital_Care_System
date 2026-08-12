import React, { useId } from 'react';
import '../styles/Input.css';

const Input = React.forwardRef(function Input(
 { label, type = 'text', className = '', ...props },
 ref
) {
 const id = useId();

 return (
   <div className="input-wrapper">
     {label && (
       <label className="input-label" htmlFor={id}>
         {label}
       </label>
     )}
     <input
       ref={ref}
       type={type}
       className={`input-field ${className}`.trim()}
       {...props}
       id={id}
     />
   </div>
 );
});

export default Input;