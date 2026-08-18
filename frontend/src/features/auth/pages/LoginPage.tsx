import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Auth.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setError(errObj.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const autofillDemo = () => {
    setEmail('dr.smith@mayoclinic.org');
    setPassword('demoPass123!');
  };

  return (
    <div className="auth-canvas">
      <div className="auth-header-badge">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <line x1="12" y1="8" x2="12" y2="14"></line>
          <line x1="9" y1="11" x2="15" y2="11"></line>
        </svg>
      </div>

      <h1 className="auth-title">Sign In to CareFlow</h1>
      <p className="auth-subtitle">
        Access the secure clinical verification dashboard and document audit trail.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <div className="hc-alert-error" style={{ marginTop: 0 }}>
            <span>{error}</span>
          </div>
        )}

        <div className="auth-field-group">
          <label className="auth-label" htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            className="auth-input"
            placeholder="physician@hospital.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field-group">
          <label className="auth-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            className="auth-input"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="auth-demo-box">
        <span>Need demo access?</span>
        <button type="button" className="auth-demo-btn" onClick={autofillDemo}>
          Autofill Demo
        </button>
      </div>

      <div className="auth-footer-link">
        Don&apos;t have an account? <Link to="/register">Register Organization</Link>
      </div>
    </div>
  );
};

export default LoginPage;
