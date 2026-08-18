import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Auth.css';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !organization) {
      setError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await register({ name, email, organization, password });
      navigate('/');
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setError(errObj.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-canvas">
      <div className="auth-header-badge">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7.5" r="4"></circle>
          <polyline points="17 11 19 13 23 9"></polyline>
        </svg>
      </div>

      <h1 className="auth-title">Register Provider</h1>
      <p className="auth-subtitle">
        Enroll your hospital, clinical network, or laboratory into the CareFlow verification network.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <div className="hc-alert-error" style={{ marginTop: 0 }}>
            <span>{error}</span>
          </div>
        )}

        <div className="auth-field-group">
          <label className="auth-label" htmlFor="reg-name">Full Name / Practitioner Name</label>
          <input
            id="reg-name"
            type="text"
            className="auth-input"
            placeholder="Dr. Sarah Jenkins"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="auth-field-group">
          <label className="auth-label" htmlFor="reg-email">Work Email</label>
          <input
            id="reg-email"
            type="email"
            className="auth-input"
            placeholder="s.jenkins@stanfordhealth.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field-group">
          <label className="auth-label" htmlFor="reg-org">Hospital / Organization</label>
          <input
            id="reg-org"
            type="text"
            className="auth-input"
            placeholder="Stanford Health Care"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
        </div>

        <div className="auth-field-group">
          <label className="auth-label" htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
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
              <span>Registering Organization...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </>
          )}
        </button>
      </form>

      <div className="auth-footer-link">
        Already registered? <Link to="/login">Sign In</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
