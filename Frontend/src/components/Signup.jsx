import React, { useState } from 'react';
import { Button, Input } from './index.js';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
 const navigate = useNavigate();
 const [error, setError] = useState('');
 const { register, handleSubmit } = useForm();

 const create = async (data) => {
   try {
     const res = await fetch('http://localhost:8000/api/v1/patient/register', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data),
     });

     const result = await res.json();

     if (res.ok) {
       setError('');
       alert('Account created successfully');
       navigate('/login');
     } else {
       setError(result.message || 'Signup failed');
     }
   } catch (err) {
     console.log(err);
     setError('Server error');
   }
 };

 return (
   <div className="signup-page">
     <div className="signup-card">
       <div className="signup-header">
         <h2 className="signup-title">Create Account</h2>
         <p className="signup-subtitle">Join Hospital Care and manage your appointments</p>
       </div>

       {error && <p className="signup-error">{error}</p>}

       <form onSubmit={handleSubmit(create)} className="signup-form">
         <Input
           label="Full Name"
           type="text"
           placeholder="Enter your full name"
           {...register('name', { required: true })}
         />

         <Input
           label="Email"
           type="email"
           placeholder="Enter your email"
           {...register('email', {
             required: true,
             validate: {
               matchPattern: (value) =>
                 /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                 'Email address must be valid',
             },
           })}
         />

         <Input
           label="Password"
           type="password"
           placeholder="Create a password"
           {...register('password', { required: true })}
         />

         <Input
           label="Confirm Password"
           type="password"
           placeholder="Confirm your password"
           {...register('confirmPassword', { required: true })}
         />

         <Button type="submit" className="signup-submit-btn">
           Create Account
         </Button>
       </form>

       <p className="signup-footer-text">
         Already have an account?{' '}
         <Link to="/login" className="signup-login-link">
           Log In
         </Link>
       </p>
     </div>
   </div>
 );
}

export default Signup;