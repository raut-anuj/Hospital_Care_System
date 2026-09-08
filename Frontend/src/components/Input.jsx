import React, { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/Input.css';

const Input = React.forwardRef(function Input(
  { label, type = 'text', className = '', ...props },
  ref
) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="input-field-container">
        <input
          ref={ref}
          type={inputType}
          className={`input-field ${isPasswordType ? 'input-field-password' : ''} ${className}`.trim()}
          {...props}
          id={id}
        />
        {isPasswordType && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
});

export default Input;