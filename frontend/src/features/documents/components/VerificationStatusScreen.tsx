import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { MedicalDocument, DocumentStatus } from '../../../types/document';
import { getDocumentStatus } from '../documentApi';
import './VerificationTimeline.css';

interface VerificationStatusScreenProps {
  initialDocument: MedicalDocument;
  onReset: () => void;
}

type StepState = 'completed' | 'active' | 'pending' | 'failed';

interface TimelineStepConfig {
  id: string;
  title: string;
  description: string;
  getStepState: (status: DocumentStatus) => StepState;
}

const TIMELINE_STEPS: TimelineStepConfig[] = [
  {
    id: 'upload',
    title: 'Document Uploaded',
    description: 'Medical document received and stored securely in HIPAA clinical vault.',
    getStepState: () => 'completed',
  },
  {
    id: 'extraction',
    title: 'AI Extraction',
    description: 'AI extracts patient identifiers, diagnosis codes, and provider info.',
    getStepState: (status) => {
      if (['AI_EXTRACTED', 'PROVIDER_IDENTIFIED', 'VERIFICATION_PENDING', 'VERIFIED', 'INVALID', 'FAILED'].includes(status)) {
        return 'completed';
      }
      if (['PROCESSING', 'UPLOADED'].includes(status)) {
        return 'active';
      }
      return 'pending';
    },
  },
  {
    id: 'provider',
    title: 'Provider Identified',
    description: 'Matched with registered hospital and healthcare practitioner registry.',
    getStepState: (status) => {
      if (['PROVIDER_IDENTIFIED', 'VERIFICATION_PENDING', 'VERIFIED', 'INVALID', 'FAILED'].includes(status)) {
        return 'completed';
      }
      if (status === 'AI_EXTRACTED') {
        return 'active';
      }
      return 'pending';
    },
  },
  {
    id: 'hospital_verification',
    title: 'Hospital Verification',
    description: 'Cross-referencing record authenticity with the provider system.',
    getStepState: (status) => {
      if (['VERIFIED', 'INVALID', 'FAILED'].includes(status)) {
        return 'completed';
      }
      if (['VERIFICATION_PENDING', 'PROVIDER_IDENTIFIED'].includes(status)) {
        return 'active';
      }
      return 'pending';
    },
  },
  {
    id: 'final_decision',
    title: 'Final Decision',
    description: 'Integrity and authenticity verdict confirmed.',
    getStepState: (status) => {
      if (status === 'VERIFIED') return 'completed';
      if (status === 'INVALID' || status === 'FAILED') return 'failed';
      return 'pending';
    },
  },
];

export const VerificationStatusScreen: React.FC<VerificationStatusScreenProps> = ({
  initialDocument,
  onReset,
}) => {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState<boolean>(false);

  // TanStack Query polling every 3 seconds until workflow completes
  const { data: document, isFetching, refetch } = useQuery<MedicalDocument>({
    queryKey: ['document-status', initialDocument.documentId],
    queryFn: () => getDocumentStatus(initialDocument.documentId),
    initialData: initialDocument,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (
        status === 'VERIFIED' ||
        status === 'INVALID' ||
        status === 'FAILED'
      ) {
        return false;
      }
      return 3000;
    },
  });

  const handleCopyId = () => {
    navigator.clipboard.writeText(document.documentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateSimulatedStatus = (newStatus: DocumentStatus, reason?: string) => {
    queryClient.setQueryData<MedicalDocument>(['document-status', initialDocument.documentId], (old) => {
      if (!old) return old;
      return {
        ...old,
        status: newStatus,
        rejectionReason: reason || old.rejectionReason,
        reason: reason || old.reason,
      };
    });
  };

  const renderStepNodeIcon = (state: StepState) => {
    if (state === 'completed') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      );
    }
    if (state === 'active') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="6"></circle>
        </svg>
      );
    }
    if (state === 'failed') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      );
    }
    return <span>?</span>;
  };

  return (
    <div className="verification-screen">
      <div className="verification-card">
        {/* Header */}
        <div className="verification-header">
          <div>
            <div className="header-badge">
              <span className="badge-dot"></span>
              Verification Pipeline
            </div>
            <h1 className="upload-title" style={{ textAlign: 'left', fontSize: '1.6rem' }}>
              Healthcare Document Verification
            </h1>
            <p className="upload-subtitle" style={{ textAlign: 'left', marginBottom: 0 }}>
              Live verification status and audit trail.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`status-badge ${document.status}`}>
              {document.status}
            </span>
          </div>
        </div>

        {/* Document Metadata Bar */}
        <div className="doc-meta-bar">
          <div className="meta-item">
            <span className="meta-label">Document ID</span>
            <span className="meta-value mono">
              {document.documentId}
              <button
                type="button"
                onClick={handleCopyId}
                title="Copy ID"
                style={{
                  background: 'transparent',
                  color: copied ? 'var(--accent-emerald)' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">File</span>
            <span className="meta-value" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {document.fileName}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Uploaded</span>
            <span className="meta-value" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {new Date(document.uploadedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-track">
          {TIMELINE_STEPS.map((step, index) => {
            const state = step.getStepState(document.status);
            const isLast = index === TIMELINE_STEPS.length - 1;

            return (
              <div key={step.id} className={`timeline-step ${state}`}>
                {!isLast && <div className="timeline-connector"></div>}
                
                <div className={`timeline-node ${state}`}>
                  {renderStepNodeIcon(state)}
                </div>

                <div className="timeline-content">
                  <div className="timeline-step-title">
                    {step.title}
                    {state === 'completed' && <span style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem' }}>✓</span>}
                    {state === 'active' && <span style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>●</span>}
                    {state === 'pending' && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>?</span>}
                    {state === 'failed' && <span style={{ color: 'var(--accent-rose)', fontSize: '0.9rem' }}>✕</span>}
                  </div>
                  <div className="timeline-step-desc">{step.description}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Decision Box (When Verified or Invalid/Failed) */}
        {document.status === 'VERIFIED' && (
          <div className="decision-box verified">
            <div className="decision-pill">VERIFIED</div>
            <div className="decision-summary">
              ✓ Document authenticity and provider credentials successfully confirmed.
            </div>
          </div>
        )}

        {(document.status === 'INVALID' || document.status === 'FAILED') && (
          <div className="decision-box invalid">
            <div className="decision-pill">INVALID</div>
            <div className="decision-summary">
              ✕ Document verification could not be completed.
            </div>
            <div className="reason-box">
              <div className="reason-title">Reason:</div>
              <div className="reason-text">
                {document.rejectionReason ||
                  document.reason ||
                  'Information provided in the document could not be verified with the provider.'}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="screen-actions">
          <button
            type="button"
            className="btn-poll"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                Checking Status (3s)...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                </svg>
                Poll Status
              </>
            )}
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{ width: 'auto', flex: 1 }}
            onClick={onReset}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload Another Document
          </button>
        </div>
      </div>

      {/* Interactive Simulation / Testing Toolbar */}
      <div className="simulation-bar">
        <span className="sim-label">Stage Simulator (Dev Preview):</span>
        <div className="sim-buttons">
          <button
            type="button"
            className="sim-btn"
            onClick={() => updateSimulatedStatus('UPLOADED')}
          >
            1. Uploaded
          </button>
          <button
            type="button"
            className="sim-btn"
            onClick={() => updateSimulatedStatus('PROCESSING')}
          >
            2. AI Extracting
          </button>
          <button
            type="button"
            className="sim-btn"
            onClick={() => updateSimulatedStatus('PROVIDER_IDENTIFIED')}
          >
            3. Provider Found
          </button>
          <button
            type="button"
            className="sim-btn"
            onClick={() => updateSimulatedStatus('VERIFICATION_PENDING')}
          >
            4. Hospital Check
          </button>
          <button
            type="button"
            className="sim-btn"
            style={{ color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)' }}
            onClick={() => updateSimulatedStatus('VERIFIED')}
          >
            5. VERIFIED
          </button>
          <button
            type="button"
            className="sim-btn"
            style={{ color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.4)' }}
            onClick={() =>
              updateSimulatedStatus(
                'INVALID',
                'Information provided in the document could not be verified with the provider.'
              )
            }
          >
            5. INVALID
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatusScreen;
