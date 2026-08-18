import React, { useState } from 'react';
import './PortfolioLanding.css';

interface PortfolioLandingProps {
  onOpenVerification: () => void;
}

export const PortfolioLanding: React.FC<PortfolioLandingProps> = ({ onOpenVerification }) => {
  const [copied, setCopied] = useState(false);

  const email = 'kausarvydesign@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="portfolio-canvas">
      {/* Top Header */}
      <header className="portfolio-header">
        <div className="email-pill-container">
          <span className="email-text">{email}</span>
          <button
            type="button"
            className="pill-action-btn"
            onClick={handleCopyEmail}
            title="Copy email to clipboard"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <a
            href="#cv"
            className="pill-action-btn"
            onClick={(e) => {
              e.preventDefault();
              alert('CV download initiated.');
            }}
          >
            CV
          </a>
        </div>

        <nav className="social-nav" aria-label="Social links">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">Linkedin</a>
          <span className="social-nav-separator">/</span>
          <a href="https://dribbble.com" target="_blank" rel="noreferrer">Dribbble</a>
          <span className="social-nav-separator">/</span>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        </nav>
      </header>

      {/* Hero Section Card */}
      <section className="hero-card">
        {/* Avatar with floating badge */}
        <div className="avatar-wrapper">
          <img
            src="/avatar.jpg"
            alt="Kausar Ahmed"
            className="avatar-img"
            onError={(e) => {
              // Fallback if image not yet loaded
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
            }}
          />
          <div className="avatar-speech-bubble">
            <span>👋</span>
            <span>Kausar Ahmed</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="hero-headline">
          Building digital products, brands, and experience.
        </h1>

        {/* CTA Button */}
        <button
          type="button"
          className="btn-dark-pill"
          onClick={onOpenVerification}
        >
          <span>Latest Shots</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </button>

        {/* Brand Logos Row */}
        <div className="logo-strip">
          {/* National Bank */}
          <div className="brand-logo-item" style={{ gap: '0.4rem', fontSize: '0.9rem', letterSpacing: '-0.02em' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 10h16v10H4zM12 3L2 9h20L12 3z" />
            </svg>
            <span style={{ fontWeight: 800 }}>NATIONAL<br /><span style={{ fontSize: '0.75rem', fontWeight: 600 }}>BANK</span></span>
          </div>

          {/* mattered */}
          <div className="brand-logo-item" style={{ fontFamily: 'serif', fontSize: '1.25rem', fontWeight: 700 }}>
            mattered<span style={{ color: '#000', fontSize: '0.85rem' }}>'</span>
          </div>

          {/* Coca Cola */}
          <div className="brand-logo-item" style={{ fontFamily: "'Brush Script MT', 'Playfair Display', cursive", fontSize: '1.45rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            Coca-Cola
          </div>

          {/* Adobe */}
          <div className="brand-logo-item" style={{ gap: '0.4rem', fontSize: '1.05rem', fontWeight: 700 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.966 22h4.884L24 3H16.48l-2.514 8.79zM10.034 22H5.15L0 3h7.52l2.514 8.79zM12 9.42L15.34 22h-3.34l-1.67-5.58H7.66z" />
            </svg>
            Adobe
          </div>

          {/* Subway */}
          <div className="brand-logo-item" style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '1.15rem', letterSpacing: '0.04em' }}>
            SUBWAY<span style={{ fontSize: '0.75rem' }}>↗</span>
          </div>

          {/* Codecademy */}
          <div className="brand-logo-item" style={{ fontSize: '0.85rem', fontWeight: 600, border: '1.5px solid #1a1a1a', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
            code<span style={{ fontWeight: 800 }}>[cademy]</span>
          </div>
        </div>
      </section>

      {/* Middle Section: Collaborate */}
      <section className="services-section">
        <h2 className="services-headline">
          Collaborate with brands and agencies to create impactful results.
        </h2>

        {/* Services Divider with pill */}
        <div className="services-divider-wrap">
          <div className="services-divider-line"></div>
          <div className="services-badge-pill">Services</div>
          <div className="services-divider-line"></div>
        </div>

        {/* 4 Column Services Grid */}
        <div className="services-grid">
          {/* Column 1 */}
          <div className="service-col">
            <div className="service-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <h3 className="service-title">UX & UI</h3>
            <p className="service-desc">
              Designing interfaces that are intuitive, efficient, and enjoyable to use.
            </p>
          </div>

          {/* Column 2 */}
          <div className="service-col">
            <div className="service-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <h3 className="service-title">Web & Mobile App</h3>
            <p className="service-desc">
              Transforming ideas into exceptional web and mobile app experiences.
            </p>
          </div>

          {/* Column 3 */}
          <div className="service-col">
            <div className="service-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <h3 className="service-title">Design & Creative</h3>
            <p className="service-desc">
              Crafting visually stunning designs that connect with your audience.
            </p>
          </div>

          {/* Column 4 */}
          <div className="service-col">
            <div className="service-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <h3 className="service-title">Development</h3>
            <p className="service-desc">
              Bringing your vision to life with the latest technology and design trends.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="cta-card">
        {/* Handshake Badge */}
        <div className="handshake-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78L12 20.66l7.65-7.65.77-.78a5.4 5.4 0 0 0 0-7.65z" />
          </svg>
        </div>

        <h2 className="cta-headline">
          Tell me about your next<br />project
        </h2>

        <div className="cta-actions">
          <a
            href={`mailto:${email}`}
            className="btn-dark-pill"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Email Me</span>
          </a>

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="btn-light-pill"
          >
            <span>WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="portfolio-footer">
        <div>© 2026 All rights reserved.</div>
        <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">Linkedin</a>
          <span className="social-nav-separator">/</span>
          <a href="https://dribbble.com" target="_blank" rel="noreferrer">Dribbble</a>
          <span className="social-nav-separator">/</span>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioLanding;
