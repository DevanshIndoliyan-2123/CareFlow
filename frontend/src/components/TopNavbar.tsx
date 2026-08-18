import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import './TopNavbar.css';

export const TopNavbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHowToUseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      const element = document.getElementById('how-to-use');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('how-to-use');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="careflow-navbar">
      {/* Brand Icon & Name */}
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <line x1="12" y1="8" x2="12" y2="14"></line>
              <line x1="9" y1="11" x2="15" y2="11"></line>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">CareFlow</span>
            <span className="brand-badge">AI Health</span>
          </div>
        </Link>
      </div>

      {/* Mobile Toggle Button */}
      <button
        type="button"
        className="navbar-mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Navigation Links */}
      <nav className={`navbar-right ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* 1. How To Use (Scrolls to section) */}
        <button
          type="button"
          onClick={handleHowToUseClick}
          className="nav-item-btn"
          id="nav-how-to-use"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>How to use</span>
        </button>

        <span className="nav-divider">/</span>

        {/* 2. Claim History */}
        <Link
          to="/claim-history"
          className={`nav-item-link ${location.pathname === '/claim-history' || location.pathname === '/claims' ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
          id="nav-claim-history"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>Claim history</span>
        </Link>

        <span className="nav-divider">/</span>

        {/* 3. User Profile */}
        <Link
          to="/profile"
          className={`nav-item-link ${location.pathname === '/profile' ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
          id="nav-user-profile"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>User Profile</span>
        </Link>

        <span className="nav-divider">/</span>

        {/* 4. Sign In / Sign Out */}
        {isAuthenticated ? (
          <div className="nav-auth-box">
            <Link
              to="/profile"
              className="user-pill"
              title="View Profile"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="user-avatar-dot"></span>
              <span className="user-name-text">
                {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Member'}
              </span>
            </Link>
            <button
              type="button"
              className="btn-signout"
              onClick={handleSignOut}
              id="nav-sign-out"
            >
              <span>Sign Out</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn-signin-pill"
            onClick={() => setMobileMenuOpen(false)}
            id="nav-sign-in"
          >
            <span>Sign In</span>
            <span className="arrow-icon">↗</span>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default TopNavbar;
