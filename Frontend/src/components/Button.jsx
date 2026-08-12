import React from 'react';
import './Button.css';

function Button({
  children,
  type = 'button',
  textColor = 'button--text-white',
  bgColor = 'button--bg-blue',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`button ${textColor} ${bgColor} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;