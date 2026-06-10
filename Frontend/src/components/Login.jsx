import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "./index.js"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Login() {
  const [error, setError] = useState("");                                                                                  
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, user, isLoading } = useAuth0();
 const { register, handleSubmit, formState: { errors } } = useForm();
    
  // 🔥 Login function
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

    console.log("STATUS:", res.status);
    console.log("RESULT:", result);

    if (res.ok && result?.data?.user && result?.data?.token) {
    localStorage.setItem("user", JSON.stringify(result.data.user));
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("role", "patient");

  navigate("/patient");
}
 else {
      setError(result?.message || "Login Failed");
    }
  } catch (err) {
    console.error(err);
    setError("Server Error");
  }
};

return (
  <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-100 p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
        <p className="mt-2 text-sm text-slate-500">
          Log in to continue to your account
        </p>
      </div>

      {error && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit(login)} className="space-y-5">
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

          {errors.email && (
            <p className="mt-2 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
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

          <div className="mt-2 flex items-center justify-between">
            <div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold shadow-sm hover:bg-blue-700 transition"
        >
          Log In
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-sm text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
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
          className="w-full rounded-xl border border-slate-300 bg-white py-3 font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
        >
          Continue with Google
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  </div>
);
}

export default Login;

// //form Validation ku jaurii ha....
// 🧠 Full Flow (step-by-step)
// 1️⃣ User form fill karta hai
// email + password dalta hai
// 2️⃣ handleSubmit(login) trigger hota hai

// 👉 React Hook Form kya karta hai:

// pehle validation check karta hai (jo tumne register me likha)
// agar error hai → login() call hi nahi hota
// agar sab sahi → login(data) call hota hai

// 👉 Frontend validation ka role
// empty input roke
// invalid email roke
// unnecessary API calls bachaye
// 👉 Backend ka role (MOST IMPORTANT)
// actual authentication
// security
// database check