import React from 'react'

function Button({
  children,
  type = 'button',
  textColor = 'text-white',
  bgColor = 'bg-blue-600',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}   // 🔥 MOST IMPORTANT
      className={`px-4 py-2 rounded-lg ${textColor} ${bgColor} ${className}`}
      {...props}    // 🔥 yaha spread karo
    >
      {children}
    </button>
  );
}

export default Button