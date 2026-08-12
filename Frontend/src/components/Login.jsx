import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "./index.js";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Login.css";

function Login() {
 const [error, setError] = useState("");
 const navigate = useNavigate();
 const { loginWithRedirect } = useAuth0();
 const { register, handleSubmit, formState: { errors } } = useForm();

 const login = async (data) => {
   try {
     const res = await fetch("http://localhost:8000/api/v1/patient/login", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         email: data.email,
         password: data.password,
       }),
     });

     const text = await res.text();

     let result;
     try {
       result = JSON.parse(text);
     } catch {
       result = {
         message: "Password is wrong",
       };
     }

     if (res.ok && result?.data?.user && result?.data?.token) {
       localStorage.setItem("user", JSON.stringify(result.data.user));
       localStorage.setItem("token", result.data.token);
       localStorage.setItem("role", "patient");
       navigate("/patient");
     } else {
       setError(result?.message || "Login Failed");
     }
   } catch (err) {
     console.error(err);
     setError("Server Error");
   }
 };

 return (
   <div className="login-page">
     <div className="login-card">
       <div className="login-header">
         <h2 className="login-title">Welcome Back</h2>
         <p className="login-subtitle">Log in to continue to your account</p>
       </div>

       {error && <p className="login-error">{error}</p>}

       <form onSubmit={handleSubmit(login)} className="login-form">
         <div>
           <Input
             label="Email"
             type="email"
             placeholder="Enter your email"
             {...register("email", {
               required: "Email is required",
               pattern: {
                 value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                 message: "Please enter a valid email address",
               },
             })}
           />

           {errors.email && <p className="login-field-error">{errors.email.message}</p>}
         </div>

         <div>
           <Input
             label="Password"
             type="password"
             placeholder="Enter your password"
             {...register("password", {
               required: "Password is required",
               minLength: {
                 value: 3,
                 message: "Password must be at least 3 characters",
               },
             })}
           />

           <div className="login-row">
             <div>
               {errors.password && (
                 <p className="login-field-error">{errors.password.message}</p>
               )}
             </div>

             <Link to="/forgot-password" className="login-link">
               Forgot Password?
             </Link>
           </div>
         </div>

         <Button type="submit" className="login-submit-btn">
           Log In
         </Button>

         <div className="login-divider">
           <div className="login-divider-line" />
           <span className="login-divider-text">or</span>
           <div className="login-divider-line" />
         </div>

         <button
           type="button"
           onClick={() =>
             loginWithRedirect({
               appState: {
                 returnTo: "/patient",
               },
             })
           }
           className="login-google-btn"
         >
           Continue with Google
         </button>
       </form>

       <p className="login-footer-text">
         Don&apos;t have an account?{' '}
         <Link to="/signup" className="login-signup-link">
           Sign Up
         </Link>
       </p>
     </div>
   </div>
 );
}

export default Login;