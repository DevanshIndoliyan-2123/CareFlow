import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavbar } from '../components/TopNavbar';
import { useAuth } from '../features/auth/AuthContext';
import './UserProfile.css';

export const UserProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Dr. Alex Vance, MD');
  const [organization, setOrganization] = useState(user?.organization || 'Mayo Clinic Health Network');
  const [specialty, setSpecialty] = useState('Cardiovascular & Diagnostic Medicine');
  const [licenseNumber, setLicenseNumber] = useState('MED-NPI-88492014');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-canvas">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Main Profile Container */}
      <div className="profile-content">
        {/* Profile Card Header */}
        <div className="profile-header-card">
          <div className="profile-avatar-row">
            <div className="profile-avatar-large">
              <span>{name.charAt(0) || 'U'}</span>
              <span className="online-badge-dot" title="Active Practitioner Session"></span>
            </div>

            <div className="profile-title-block">
              <div className="profile-badge-row">
                <span className="practitioner-tag">HIPAA Verified Practitioner</span>
                <span className="role-tag">{user?.role || 'PHYSICIAN'}</span>
              </div>
              <h1 className="profile-user-name">{name}</h1>
              <p className="profile-user-email">
                {user?.email || 'amangusainofficial@gmail.com'}
              </p>
              <div className="profile-org-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M10 11h2M10 15h2M14 11h2M14 15h2M18 11h2M18 15h2M9 3h6v4H9z"></path>
                </svg>
                <span>{organization}</span>
              </div>
            </div>
          </div>

          <div className="profile-header-actions">
            {!isEditing ? (
              <button
                type="button"
                className="btn-edit-profile"
                onClick={() => setIsEditing(true)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn-cancel-edit"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              className="btn-signout-profile"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="profile-alert-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Profile credentials updated successfully!</span>
          </div>
        )}

        {/* Practitioner Details Card */}
        <div className="profile-section-card">
          <h2 className="section-title">Practitioner Credentials</h2>
          <p className="section-desc">Medical identification used for EMR integration and claim verification.</p>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="profile-edit-form">
              <div className="form-group">
                <label className="form-label">Full Name & Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Medical Specialty</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hospital / Healthcare Organization</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">NPI / Medical License ID</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="btn-save-profile">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="profile-info-grid">
              <div className="info-item">
                <span className="info-item-label">Medical Specialty</span>
                <span className="info-item-value">{specialty}</span>
              </div>

              <div className="info-item">
                <span className="info-item-label">National Provider Identifier (NPI)</span>
                <span className="info-item-value mono">{licenseNumber}</span>
              </div>

              <div className="info-item">
                <span className="info-item-label">Hospital Network</span>
                <span className="info-item-value">{organization}</span>
              </div>

              <div className="info-item">
                <span className="info-item-label">HIPAA Audit Status</span>
                <span className="info-item-value text-emerald" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>✓</span> Level 3 Validated
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Verification Activity Stats Row */}
        <div className="profile-stats-card">
          <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>Practitioner Verification Stats</h2>
          <div className="stats-metric-row">
            <div className="stat-box">
              <span className="stat-num">142</span>
              <span className="stat-label">Documents Verified</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">99.8%</span>
              <span className="stat-label">AI Extraction Accuracy</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">0</span>
              <span className="stat-label">Compliance Flags</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">6</span>
              <span className="stat-label">Partner Hospital Networks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
