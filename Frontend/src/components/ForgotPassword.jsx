import React, { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const checkEmail = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8000/api/v1/patient/forgotPassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            action: "check-email",
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setStep("password");
        setMessage(result.message || "Email verified successfully");
      } else {
        setError(result.message || "Email does not exist");
      }
    } catch (err) {
      setError("No Patient found with this email Id"); 
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Both password fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8000/api/v1/patient/forgotPassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          email,
          newPassword: password,
          confirmPassword,
          action: "reset-password",
        }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        alert(result.message || "Password changed successfully");
        navigate("/login");
      } else {
        setError(result.message || "Password update failed");
      }
    } catch (err) {
      setError("Password not updated due to server"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <Link
          to="/login"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          <ArrowLeft size={20} />
        </Link>

        <div className="mt-8">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-5">
            <Mail className="text-blue-600" size={24} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {step === "email" ? "Find Your Account" : "Reset Password"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {step === "email"
              ? "Enter your email address to find your account."
              : `Create a new password for ${email}`}
          </p>
        </div>

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
            {message}
          </p>
        )}

        {step === "email" ? (
          <form onSubmit={checkEmail} className="mt-7 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={updatePassword} className="mt-7 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Remember your password?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;