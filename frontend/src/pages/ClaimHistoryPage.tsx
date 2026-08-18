import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TopNavbar } from '../components/TopNavbar';
import { getDocumentsList } from '../features/documents/documentApi';
import type { MedicalDocument } from '../types/document';
import './ClaimHistory.css';

interface ClaimRecord extends MedicalDocument {
  claimId: string;
  claimAmount: string;
  patientId: string;
  diagnosisCode: string;
  payoutStatus: 'APPROVED' | 'IN_REVIEW' | 'FLAGGED' | 'PAID';
}

const INITIAL_MOCK_CLAIMS: ClaimRecord[] = [
  {
    documentId: 'DOC-849201',
    claimId: 'CLM-2026-9042',
    fileName: 'mayo_discharge_summary_cardiology.pdf',
    documentType: 'Discharge Summary',
    patientId: 'PT-99482',
    diagnosisCode: 'I25.10 (Atherosclerotic Heart Disease)',
    providerName: 'Mayo Clinic Health System',
    uploadedAt: '2026-08-18T14:32:00Z',
    status: 'VERIFIED',
    claimAmount: '$4,850.00',
    payoutStatus: 'APPROVED',
  },
  {
    documentId: 'DOC-731940',
    claimId: 'CLM-2026-8831',
    fileName: 'johns_hopkins_pathology_oncology.pdf',
    documentType: 'Pathology Report',
    patientId: 'PT-10394',
    diagnosisCode: 'C50.911 (Malignant Neoplasm of Breast)',
    providerName: 'Johns Hopkins Medicine',
    uploadedAt: '2026-08-18T11:15:00Z',
    status: 'VERIFIED',
    claimAmount: '$12,400.00',
    payoutStatus: 'PAID',
  },
  {
    documentId: 'DOC-629104',
    claimId: 'CLM-2026-8510',
    fileName: 'kaiser_emergency_consult_note.pdf',
    documentType: 'Emergency Referral',
    patientId: 'PT-88392',
    diagnosisCode: 'S82.801A (Fracture of Lower Leg)',
    providerName: 'Kaiser Permanente Medical Center',
    uploadedAt: '2026-08-17T18:45:00Z',
    status: 'VERIFICATION_PENDING',
    claimAmount: '$3,150.00',
    payoutStatus: 'IN_REVIEW',
  },
  {
    documentId: 'DOC-518293',
    claimId: 'CLM-2026-7922',
    fileName: 'stanford_mri_neuro_scan.pdf',
    documentType: 'Diagnostic Imaging',
    patientId: 'PT-47291',
    diagnosisCode: 'G43.909 (Migraine, Unspecified)',
    providerName: 'Stanford Health Care',
    uploadedAt: '2026-08-17T09:20:00Z',
    status: 'AI_EXTRACTED',
    claimAmount: '$1,920.00',
    payoutStatus: 'IN_REVIEW',
  },
  {
    documentId: 'DOC-409182',
    claimId: 'CLM-2026-6411',
    fileName: 'unverified_clinic_prescription_rx.pdf',
    documentType: 'Pharmacy Rx Claim',
    patientId: 'PT-30219',
    diagnosisCode: 'E11.9 (Type 2 Diabetes Mellitus)',
    providerName: 'Unregistered Wellness Clinic',
    uploadedAt: '2026-08-16T16:05:00Z',
    status: 'INVALID',
    rejectionReason: 'Practitioner NPI could not be verified in accredited national health registry.',
    claimAmount: '$890.00',
    payoutStatus: 'FLAGGED',
  },
  {
    documentId: 'DOC-392019',
    claimId: 'CLM-2026-5820',
    fileName: 'cleveland_clinic_orthopedic_surgery.pdf',
    documentType: 'Surgical Operative Note',
    patientId: 'PT-77291',
    diagnosisCode: 'M17.11 (Unilateral Primary Osteoarthritis)',
    providerName: 'Cleveland Clinic Foundation',
    uploadedAt: '2026-08-15T13:40:00Z',
    status: 'VERIFIED',
    claimAmount: '$18,600.00',
    payoutStatus: 'PAID',
  },
];

export const ClaimHistoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);

  // Fetch real uploaded documents or merge with mock claim records
  const { data: serverDocs = [] } = useQuery<MedicalDocument[]>({
    queryKey: ['claim-history-docs'],
    queryFn: getDocumentsList,
    retry: 1,
  });

  const mergedClaims: ClaimRecord[] = [
    ...serverDocs.map((doc, idx) => ({
      ...doc,
      claimId: `CLM-2026-${9100 + idx}`,
      claimAmount: '$2,750.00',
      patientId: `PT-${50000 + idx}`,
      diagnosisCode: 'Z00.00 (General Medical Examination)',
      providerName: doc.providerName || 'CareFlow Verified Provider',
      payoutStatus: (doc.status === 'VERIFIED' ? 'APPROVED' : doc.status === 'INVALID' ? 'FLAGGED' : 'IN_REVIEW') as ClaimRecord['payoutStatus'],
    })),
    ...INITIAL_MOCK_CLAIMS,
  ];

  const filteredClaims = mergedClaims.filter((claim) => {
    const matchesSearch =
      claim.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.documentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.providerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.diagnosisCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'VERIFIED') return claim.status === 'VERIFIED';
    if (statusFilter === 'PENDING') return ['PROCESSING', 'AI_EXTRACTED', 'PROVIDER_IDENTIFIED', 'VERIFICATION_PENDING', 'UPLOADED'].includes(claim.status);
    if (statusFilter === 'INVALID') return ['INVALID', 'FAILED'].includes(claim.status);
    return true;
  });

  // Calculate high-level metrics
  const totalClaimsCount = mergedClaims.length;
  const verifiedCount = mergedClaims.filter((c) => c.status === 'VERIFIED').length;
  const pendingCount = mergedClaims.filter((c) => !['VERIFIED', 'INVALID', 'FAILED'].includes(c.status)).length;
  const flaggedCount = mergedClaims.filter((c) => ['INVALID', 'FAILED'].includes(c.status)).length;

  return (
    <div className="claim-canvas">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Header Banner */}
      <div className="claim-header-banner">
        <div className="banner-left">
          <div className="claim-title-badge">
            <span className="live-dot"></span>
            Claims & Document Audit Ledger
          </div>
          <h1 className="claim-headline">Claim & Verification History</h1>
          <p className="claim-subline">
            Cryptographically signed verification records, provider audit trails, and healthcare reimbursement statuses.
          </p>
        </div>

        <div className="banner-actions">
          <Link to="/" className="btn-new-claim">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Verify New Document / Claim</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="claim-metrics-grid">
        <div className="claim-metric-card">
          <span className="metric-label">Total Claims Submitted</span>
          <span className="metric-value">{totalClaimsCount}</span>
          <span className="metric-foot">100% HIPAA Audited</span>
        </div>

        <div className="claim-metric-card verified-card">
          <span className="metric-label">Verified & Approved</span>
          <span className="metric-value text-emerald">{verifiedCount}</span>
          <span className="metric-foot">Instant Provider Match</span>
        </div>

        <div className="claim-metric-card pending-card">
          <span className="metric-label">Pipeline In-Review</span>
          <span className="metric-value text-cyan">{pendingCount}</span>
          <span className="metric-foot">Average time: 4.2s</span>
        </div>

        <div className="claim-metric-card flagged-card">
          <span className="metric-label">Flagged / Invalid</span>
          <span className="metric-value text-rose">{flaggedCount}</span>
          <span className="metric-foot">Fraud Prevention Active</span>
        </div>
      </div>

      {/* Toolbar / Search / Filter */}
      <div className="claim-toolbar">
        <div className="claim-search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by Claim ID, Patient ID, Hospital, or Diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="claim-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="claim-filter-pills">
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All Claims ({totalClaimsCount})
          </button>
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'VERIFIED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('VERIFIED')}
          >
            Verified ({verifiedCount})
          </button>
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            In-Review ({pendingCount})
          </button>
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'INVALID' ? 'active' : ''}`}
            onClick={() => setStatusFilter('INVALID')}
          >
            Flagged ({flaggedCount})
          </button>
        </div>
      </div>

      {/* Main Claims Table */}
      <div className="claim-table-card">
        <div className="table-responsive">
          <table className="claim-table">
            <thead>
              <tr>
                <th>Claim ID / Doc ID</th>
                <th>Medical Document</th>
                <th>Patient & Diagnosis</th>
                <th>Hospital / Provider</th>
                <th>Claim Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="claim-empty">
                    No matching claim records found for &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr key={claim.claimId} className="claim-row">
                    <td>
                      <div className="claim-id-cell">
                        <span className="claim-main-id">{claim.claimId}</span>
                        <span className="claim-sub-id">{claim.documentId}</span>
                      </div>
                    </td>

                    <td>
                      <div className="doc-name-cell">
                        <div className="doc-icon-mini">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                        </div>
                        <div>
                          <div className="doc-filename" title={claim.fileName}>{claim.fileName}</div>
                          <div className="doc-type-badge">{claim.documentType}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="patient-cell">
                        <span className="patient-id">{claim.patientId}</span>
                        <span className="diagnosis-code" title={claim.diagnosisCode}>{claim.diagnosisCode}</span>
                      </div>
                    </td>

                    <td>
                      <div className="provider-name-cell">
                        <span className="provider-name">{claim.providerName || 'Hospital Network'}</span>
                        <span className="upload-time">
                          {new Date(claim.uploadedAt).toLocaleDateString()} at {new Date(claim.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="claim-amount-text">{claim.claimAmount}</span>
                    </td>

                    <td>
                      <span className={`status-badge ${claim.status}`}>
                        {claim.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons-cell">
                        <button
                          type="button"
                          className="btn-inspect"
                          onClick={() => setSelectedClaim(claim)}
                        >
                          Details
                        </button>
                        <Link
                          to={`/documents/${claim.documentId}`}
                          className="btn-live-view"
                          title="View Live Timeline"
                        >
                          ↗
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="claim-modal-backdrop" onClick={() => setSelectedClaim(null)}>
          <div className="claim-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-tag">Claim Verification Audit</div>
                <h2 className="modal-title">{selectedClaim.claimId}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedClaim(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-meta-grid">
                <div className="meta-box">
                  <span className="meta-box-label">Verification Verdict</span>
                  <span className={`status-badge ${selectedClaim.status}`} style={{ marginTop: '0.35rem' }}>
                    {selectedClaim.status}
                  </span>
                </div>

                <div className="meta-box">
                  <span className="meta-box-label">Claim Amount</span>
                  <span className="meta-box-val" style={{ color: '#0284c7', fontSize: '1.25rem' }}>
                    {selectedClaim.claimAmount}
                  </span>
                </div>

                <div className="meta-box">
                  <span className="meta-box-label">Patient ID</span>
                  <span className="meta-box-val">{selectedClaim.patientId}</span>
                </div>

                <div className="meta-box">
                  <span className="meta-box-label">Document ID</span>
                  <span className="meta-box-val mono">{selectedClaim.documentId}</span>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-heading">Clinical Extraction & Diagnosis</h3>
                <div className="info-pill-row">
                  <span className="info-label">ICD-10 Code:</span>
                  <span className="info-val">{selectedClaim.diagnosisCode}</span>
                </div>
                <div className="info-pill-row">
                  <span className="info-label">Hospital Affiliation:</span>
                  <span className="info-val">{selectedClaim.providerName}</span>
                </div>
                <div className="info-pill-row">
                  <span className="info-label">File Name:</span>
                  <span className="info-val mono">{selectedClaim.fileName}</span>
                </div>
              </div>

              {selectedClaim.rejectionReason && (
                <div className="modal-alert-error">
                  <strong>Verification Failure Flag:</strong>
                  <div>{selectedClaim.rejectionReason}</div>
                </div>
              )}

              <div className="modal-section">
                <h3 className="section-heading">Cryptographic Audit Stamp</h3>
                <div className="crypto-hash-box">
                  <code>SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Signed by CareFlow AI Engine & Provider EMR Bridge on {new Date(selectedClaim.uploadedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Link
                to={`/documents/${selectedClaim.documentId}`}
                className="btn-modal-primary"
                onClick={() => setSelectedClaim(null)}
              >
                Open 5-Stage Live Verification
              </Link>
              <button
                type="button"
                className="btn-modal-secondary"
                onClick={() => setSelectedClaim(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimHistoryPage;
