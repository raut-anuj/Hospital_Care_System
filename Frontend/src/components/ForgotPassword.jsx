import React, { useState } from 'react';
import { ArrowLeft, Mail, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from "../api/api";
import '../styles/ForgotPassword.css';

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const checkEmail = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
         `${API_URL}/api/v1/patient/forgotPassword`,
        // 'http://localhost:8000/api/v1/patient/forgotPassword', 
        {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          action: 'check-email',
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setStep('password');
        setMessage(result.message || 'Email verified successfully');
      } else {
        setError(result.message || 'Email does not exist');
      }
    } catch (err) {
      setError('No Patient found with this email Id');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and confirm password do not match');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/v1/patient/forgotPassword`,
        // 'http://localhost:8000/api/v1/patient/forgotPassword',
        {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword: password,
          confirmPassword,
          action: 'reset-password',
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message || 'Password changed successfully');
        navigate('/login');
      } else {
        setError(result.message || 'Password update failed');
      }
    } catch (err) {
      setError('Password not updated due to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <Link to="/login" className="forgot-back-btn">
          <ArrowLeft size={20} />
        </Link>

        <div className="forgot-header">
          <div className="forgot-icon-wrap">
            <Mail className="forgot-icon" size={24} />
          </div>

          <h1 className="forgot-title">
            {step === 'email' ? 'Find Your Account' : 'Reset Password'}
          </h1>

          <p className="forgot-subtitle">
            {step === 'email'
              ? 'Enter your email address to find your account.'
              : `Create a new password for ${email}`}
          </p>
        </div>

        {error && <p className="forgot-error">{error}</p>}

        {message && <p className="forgot-message">{message}</p>}

        {step === 'email' ? (
          <form onSubmit={checkEmail} className="forgot-form">
            <div>
              <label className="forgot-label">Email address</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="forgot-input"
              />
            </div>

            <button type="submit" disabled={loading} className="forgot-submit-btn">
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={updatePassword} className="forgot-form">
            <div>
              <label className="forgot-label">New Password</label>
              <div className="forgot-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="forgot-input forgot-input-password"
                />
                <button
                  type="button"
                  className="forgot-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="forgot-label">Confirm Password</label>
              <div className="forgot-password-wrap">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="forgot-input forgot-input-password"
                />
                <button
                  type="button"
                  className="forgot-password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="forgot-submit-btn">
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        )}

        <p className="forgot-footer-text">
          Remember your password?{' '}
          <Link to="/login" className="forgot-login-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;