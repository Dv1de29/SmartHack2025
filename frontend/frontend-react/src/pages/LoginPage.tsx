import React, { useState } from 'react';
import './styles/LoginPage.css';
import {
  FaBuilding,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaGithub,
} from 'react-icons/fa';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <header className="login-header">
          <div className="logo">
            <FaBuilding />
          </div>
          <h1>Molson Coors</h1>
        </header>

        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your account to continue</p>

          <form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password">Password</label>
                <a href="#" className="forgot-link">
                  Forgot?
                </a>
              </div>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="input-field"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="options">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me for 30 days</label>
            </div>

            <button type="submit" className="signin-btn">
              Sign In
            </button>
          </form>

          <div className="divider">OR CONTINUE WITH</div>

          <div className="social-login">
            <button className="social-btn google">
              <FaGoogle />
              Google
            </button>
            <button className="social-btn github">
              <FaGithub />
              GitHub
            </button>
          </div>

          <p className="signup-link">
            Don't have an account? <a href="#">Sign up for free</a>
          </p>
        </div>
      </div>
      <footer className="footer-legal">
        <p>
          By continuing, you agree to our <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;