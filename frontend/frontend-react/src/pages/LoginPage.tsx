import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setError(null);

  if (!email || !password) {
    setError("Veuillez saisir votre email et votre mot de passe.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();

    console.log(data)

    // Store tokens and user info
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("role", data.role);
    localStorage.setItem("email", data.email);

    // Redirect to homepage or dashboard
    navigate("/");

  } catch (err) {
    console.error("Login attempt failed:", err);
    setError("Email ou mot de passe incorrect. Veuillez réessayer.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-page">
      <button className="back-btn" onClick={handleBackClick}>
        {'<-'}
      </button>
      <div className="login-container">
        <header className="login-header">
          <div className="logo">{/* Logo Placeholder */}</div>
          <h1>Molson Coors</h1>
        </header>

        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your account to continue</p>

          {/* Bind handleSubmit to the form's onSubmit event */}
          <form onSubmit={handleSubmit}> 
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                {/* Icon Placeholder */}
                <input
                  type="email"
                  id="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={email} // Bind state
                  onChange={(e) => setEmail(e.target.value)} // Update state
                  disabled={loading} // Disable during loading
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
                {/* Icon Placeholder */}
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password} // Bind state
                  onChange={(e) => setPassword(e.target.value)} // Update state
                  disabled={loading} // Disable during loading
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            
            {/* Error Message Display */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="options">
              <input type="checkbox" id="remember" disabled={loading}/>
              <label htmlFor="remember">Remember me for 30 days</label>
            </div>

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? 'Connexion...' : 'Sign In'}
            </button>
          </form>

          <div className="divider">OR CONTINUE WITH</div>

          <div className="social-login">
            <button className="social-btn google" disabled={loading}>
              Google
            </button>
            <button className="social-btn github" disabled={loading}>
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