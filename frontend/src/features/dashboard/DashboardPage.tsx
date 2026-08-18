import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TopNavbar } from '../../components/TopNavbar';
import { useAuth } from '../auth/AuthContext';
import { getDocumentsList } from '../documents/documentApi';
import type { MedicalDocument } from '../../types/document';
import { VerificationStatusScreen } from '../documents/components/VerificationStatusScreen';
import './Dashboard.css';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [activeInspectingDoc, setActiveInspectingDoc] = useState<MedicalDocument | null>(null);

  const { data: documents = [], isLoading } = useQuery<MedicalDocument[]>({
    queryKey: ['documents-list'],
    queryFn: getDocumentsList,
    refetchInterval: 5000,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.documentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.providerName && doc.providerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatusFilter === 'ALL'
        ? true
        : selectedStatusFilter === 'VERIFIED'
        ? doc.status === 'VERIFIED'
        : selectedStatusFilter === 'PROCESSING'
        ? ['UPLOADED', 'PROCESSING', 'AI_EXTRACTED', 'PROVIDER_IDENTIFIED', 'VERIFICATION_PENDING'].includes(doc.status)
        : selectedStatusFilter === 'INVALID'
        ? doc.status === 'INVALID' || doc.status === 'FAILED'
        : true;

    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalDocs = documents.length;
  const verifiedDocs = documents.filter((d) => d.status === 'VERIFIED').length;
  const inFlightDocs = documents.filter((d) =>
    ['UPLOADED', 'PROCESSING', 'AI_EXTRACTED', 'PROVIDER_IDENTIFIED', 'VERIFICATION_PENDING'].includes(d.status)
  ).length;
  const invalidDocs = documents.filter((d) => d.status === 'INVALID' || d.status === 'FAILED').length;

  return (
    <div className="dash-canvas">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Header */}
      <header className="dash-header">
        <div className="dash-user-badge">
          <div className="dash-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="dash-user-info">
            <div className="dash-user-name">{user?.name || 'Healthcare Practitioner'}</div>
            <div className="dash-user-org">{user?.organization || 'CareFlow Verification Network'}</div>
          </div>
        </div>

        <div className="dash-actions-row">
          <Link to="/" className="btn-light-pill" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            <span>+ New Upload</span>
          </Link>
          <button
            type="button"
            className="pill-action-btn"
            onClick={handleLogout}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="dash-metrics-grid">
        <div className="dash-metric-card">
          <span className="dash-metric-label">Total Submissions</span>
          <span className="dash-metric-value">{totalDocs}</span>
        </div>

        <div className="dash-metric-card" style={{ borderColor: 'rgba(16, 185, 129, 0.25)' }}>
          <span className="dash-metric-label" style={{ color: '#10b981' }}>Verified Records</span>
          <span className="dash-metric-value" style={{ color: '#059669' }}>{verifiedDocs}</span>
        </div>

        <div className="dash-metric-card" style={{ borderColor: 'rgba(2, 132, 199, 0.25)' }}>
          <span className="dash-metric-label" style={{ color: '#0284c7' }}>In Verification</span>
          <span className="dash-metric-value" style={{ color: '#0284c7' }}>{inFlightDocs}</span>
        </div>

        <div className="dash-metric-card" style={{ borderColor: 'rgba(239, 68, 68, 0.25)' }}>
          <span className="dash-metric-label" style={{ color: '#ef4444' }}>Invalid / Rejected</span>
          <span className="dash-metric-value" style={{ color: '#dc2626' }}>{invalidDocs}</span>
        </div>
      </div>

      {/* Toolbar: Search + Filter Pills */}
      <div className="dash-toolbar">
        <div className="dash-search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="dash-search-input"
            placeholder="Search by ID, file, or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="dash-filter-pills">
          {['ALL', 'VERIFIED', 'PROCESSING', 'INVALID'].map((filter) => (
            <button
              key={filter}
              type="button"
              className={`dash-filter-pill ${selectedStatusFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedStatusFilter(filter)}
            >
              {filter === 'PROCESSING' ? 'In Progress' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Document Table */}
      <div className="dash-table-card">
        {isLoading ? (
          <div className="dash-empty-state">
            <span className="spinner" style={{ width: '20px', height: '20px', display: 'inline-block', borderColor: '#0284c7', borderTopColor: 'transparent' }}></span>
            <div style={{ marginTop: '0.75rem' }}>Loading documents...</div>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="dash-empty-state">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <div style={{ fontWeight: 600, marginTop: '0.5rem' }}>No medical documents found</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Try adjusting your search query or upload a new PDF.</div>
          </div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Document ID</th>
                <th>File Name</th>
                <th>Type</th>
                <th>Provider</th>
                <th>Uploaded</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.documentId}>
                  <td className="table-doc-id">
                    <Link to={`/documents/${doc.documentId}`} style={{ color: '#0284c7', textDecoration: 'none' }}>
                      {doc.documentId}
                    </Link>
                  </td>
                  <td className="table-filename" title={doc.fileName}>{doc.fileName}</td>
                  <td>{doc.documentType || 'Clinical Report'}</td>
                  <td>{doc.providerName || 'Evaluating...'}</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(doc.uploadedAt).toLocaleDateString()} {new Date(doc.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <span className={`status-badge ${doc.status}`} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn-table-action"
                      onClick={() => setActiveInspectingDoc(doc)}
                    >
                      <span>Inspect</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Inspector for Selected Document */}
      {activeInspectingDoc && (
        <div className="modal-backdrop" onClick={() => setActiveInspectingDoc(null)}>
          <div className="modal-content-wrap" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setActiveInspectingDoc(null)}
              title="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <VerificationStatusScreen
              initialDocument={activeInspectingDoc}
              onReset={() => setActiveInspectingDoc(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
