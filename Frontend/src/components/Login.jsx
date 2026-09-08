import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "./index.js";
import { useForm } from "react-hook-form";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/Login.css";
import API_URL from "../api/api";

function Login() {
 const [error, setError] = useState("");
 const navigate = useNavigate();
 const { loginWithRedirect } = useAuth0();
 const { register, handleSubmit, formState: { errors } } = useForm();

 const login = async (data) => {
   try {
     const res = await fetch(
        `${API_URL}/api/v1/auth/login`,
      {
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

     if (res.ok && result?.data?.user && result?.data?.token && result?.data?.role) {
       const role = result.data.role;
       localStorage.setItem("user", JSON.stringify(result.data.user));
       localStorage.setItem("token", result.data.token);
       localStorage.setItem("role", role);
       navigate(`/${role}`);
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
               authorizationParams: {
                 connection: "google-oauth2",
               },
               appState: {
                 returnTo: "/patient",
               },
             })
           }
           className="login-google-btn"
         >
           <svg
             className="login-google-icon"
             viewBox="0 0 24 24"
             aria-hidden="true"
           >
             <path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.26Z" />
             <path fill="#34A853" d="M12 21.78c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.78Z" />
             <path fill="#FBBC05" d="M6.54 13.87A5.86 5.86 0 0 1 6.23 12c0-.65.11-1.28.31-1.87V7.6H3.3A9.76 9.76 0 0 0 2.25 12c0 1.58.38 3.07 1.05 4.4l3.24-2.53Z" />
             <path fill="#EA4335" d="M12 6.1c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.18 14.63 2.22 12 2.22a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 7.82 9.46 6.1 12 6.1Z" />
           </svg>
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