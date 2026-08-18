export type DocumentStatus =
  | "UPLOADED"
  | "PROCESSING"
  | "AI_EXTRACTED"
  | "PROVIDER_IDENTIFIED"
  | "VERIFICATION_PENDING"
  | "VERIFIED"
  | "INVALID"
  | "FAILED";

export interface MedicalDocument {
  documentId: string;
  fileName: string;
  documentType: string;
  uploadedAt: string;
  status: DocumentStatus;
  rejectionReason?: string;
  reason?: string;
  providerName?: string;
}

/**
 * Standardized Unified API Error Response across all services (Member 2 contract)
 */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  code: string;
  message: string;
}
