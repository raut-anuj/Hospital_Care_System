import React, {useState} from 'react'
import {Button, Input} from './index.js'
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("")
  // const dispatch = useDispatch()
  const {register, handleSubmit} = useForm()

 const create = async (data) => {
  console.log("SIGNUP DATA:", data);

  try {
    const res = await fetch("http://localhost:8000/api/v1/patient/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("STATUS:", res.status);
    
    const result = await res.json();
    console.log("BACKEND RESULT:", result);

    if (res.ok) {
      setError("");
      alert("Account created successfully");
      navigate("/login");
    } else {
      setError(result.message || "Signup failed");
    }
  } catch (err) {
    console.log(err);
    setError("Server error");
  }
};

return (
  <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-100 p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Create Account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Join Hospital Care and manage your appointments
        </p>
      </div>

      {error && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit(create)} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          {...register("name", { required: true })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("email", {
            required: true,
            validate: {
              matchPattern: (value) =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "Email address must be valid",
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          {...register("password", { required: true })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          {...register("confirmPassword", { required: true })}
        />

        <Button
          type="submit"
          className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold shadow-sm hover:bg-blue-700 transition"
        >
          Create Account
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Log In
        </Link>
      </p>
    </div>
  </div>
);
}

export default Signup 