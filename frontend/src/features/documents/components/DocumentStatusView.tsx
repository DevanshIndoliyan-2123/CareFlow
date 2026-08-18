import React from 'react';
import type { MedicalDocument } from '../../../types/document';
import './DocumentUpload.css';

interface DocumentStatusViewProps {
  document: MedicalDocument;
  onReset: () => void;
}

export const DocumentStatusView: React.FC<DocumentStatusViewProps> = ({ document, onReset }) => {
  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return isoString;
    }
  };

  return (
    <div className="upload-container">
      <div className="status-card">
        <div style={{ textAlign: 'center' }}>
          <div className="header-badge">
            <span className="badge-dot"></span>
            Document Status
          </div>
        </div>

        <h1 className="upload-title" style={{ fontSize: '1.5rem', textAlign: 'center' }}>
          Document Submitted Successfully
        </h1>
        <p className="status-description">
          Your document is now securely ingested and queued for verification.
        </p>

        <div className="status-grid">
          <div>
            <div className="status-field-label">Document ID</div>
            <div className="status-field-value" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
              {document.documentId}
            </div>
          </div>

          <div>
            <div className="status-field-label">File Name</div>
            <div className="status-field-value">{document.fileName}</div>
          </div>

          <div>
            <div className="status-field-label">Status</div>
            <div>
              <span className={`status-badge ${document.status}`}>
                {document.status}
              </span>
            </div>
          </div>

          <div>
            <div className="status-field-label">Document Type</div>
            <div className="status-field-value">{document.documentType || 'Medical Report'}</div>
          </div>

          <div>
            <div className="status-field-label">Uploaded At</div>
            <div className="status-field-value" style={{ fontSize: '0.85rem' }}>
              {formatDate(document.uploadedAt)}
            </div>
          </div>
        </div>

        <button type="button" className="btn-secondary" onClick={onReset}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Upload Another Document
        </button>
      </div>
    </div>
  );
};

export default DocumentStatusView;
