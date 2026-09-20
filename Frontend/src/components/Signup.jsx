import React, { useState } from 'react';
import { Button, Input } from './index.js';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import API_URL from "../api/api.js"

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  //Sign Up Valdiation in frontend.
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();

  const create = async (data) => {
   try {
     const res = await fetch(
        `${API_URL}/api/v1/patient/register`,
      // 'http://localhost:8000/api/v1/patient/register', 
      {
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
           {...register('name', { required: 'Name is required' })}
         />
         {errors.name && <p className="signup-field-error">{errors.name.message}</p>}

         <Input
           label="Email"
           type="email"
           placeholder="Enter your email"
           {...register('email', {
             required: 'Email is required',
             validate: {
               matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Email address must be valid',
             },
           })}
         />
         {errors.email && <p className="signup-field-error">{errors.email.message}</p>}

         <Input
           label="Age"
           type="number"
           min="1"
           max="120"
           placeholder="Enter your age"
           {...register('age', {
             required: 'Age is required',
             valueAsNumber: true,
             min: { value: 1, message: 'Age must be at least 1' },
             max: { value: 120, message: 'Age must be 120 or less' },
           })}
         />
         {errors.age && <p className="signup-field-error">{errors.age.message}</p>}

          <div className="input-wrapper">
            <label className="input-label">Gender</label>
            <div className="input-field-container">
              <select className="input-field" {...register('gender', { required: 'Gender is required' })}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {errors.gender && <p className="signup-field-error">{errors.gender.message}</p>}

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            {...register('contactNumber')}
          />

          <div className="input-wrapper">
            <label className="input-label">Blood Group</label>
            <div className="input-field-container">
              <select className="input-field" {...register('bloodgroup')}>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <Input
            label="Address"
            type="text"
            placeholder="Enter your address"
            {...register('address')}
          />

         <Input
           label="Password"
           type="password"
           placeholder="Create a password"
           {...register('password', {
             required: 'Password is required',
             minLength: { value: 6, message: 'Password must be at least 6 characters' },
             validate: {
               noSpaces: (v) => (!/\s/.test(v)) || 'Password must not contain spaces',
               hasNumber: (v) => /[0-9]/.test(v) || 'Password must contain at least one number',
               hasSpecial: (v) => /[^A-Za-z0-9\s]/.test(v) || 'Password must contain at least one special character'
             }
           })}
         />
         {errors.password && <p className="signup-field-error">{errors.password.message}</p>}

         <Input
           label="Confirm Password"
           type="password"
           placeholder="Confirm your password"
           {...register('confirmPassword', {
             required: 'Confirm password is required',
             validate: (v) => v === getValues('password') || 'Passwords do not match'
           })}
         />
         {errors.confirmPassword && <p className="signup-field-error">{errors.confirmPassword.message}</p> }

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