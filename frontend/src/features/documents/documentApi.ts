import { apiClient } from "../../services/apiClient";
import type { MedicalDocument } from "../../types/document";

export async function uploadDocument(
  file: File,
  onProgress?: (percentage: number) => void
): Promise<MedicalDocument> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<MedicalDocument>(
    "/documents",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  return response.data;
}

export async function getDocumentStatus(
  documentId: string
): Promise<MedicalDocument> {
  const response = await apiClient.get<MedicalDocument>(
    `/documents/${documentId}/status`
  );
  return response.data;
}

export async function getDocument(
  documentId: string
): Promise<MedicalDocument> {
  const response = await apiClient.get<MedicalDocument>(
    `/documents/${documentId}`
  );
  return response.data;
}

export async function getDocumentsList(): Promise<MedicalDocument[]> {
  try {
    const response = await apiClient.get<MedicalDocument[]>("/documents");
    return response.data;
  } catch {
    // Fallback mock history for dashboard testing
    return [
      {
        documentId: "DOC10001",
        fileName: "mayo_clinical_summary.pdf",
        documentType: "Clinical Summary",
        uploadedAt: "2026-08-17T14:20:00Z",
        status: "VERIFIED",
        providerName: "Mayo Clinic Rochester",
      },
      {
        documentId: "DOC10002",
        fileName: "johns_hopkins_referral.pdf",
        documentType: "Physician Referral",
        uploadedAt: "2026-08-17T15:05:00Z",
        status: "VERIFIED",
        providerName: "Johns Hopkins Medicine",
      },
      {
        documentId: "DOC10003",
        fileName: "lab_bloodwork_panel.pdf",
        documentType: "Diagnostic Lab",
        uploadedAt: "2026-08-17T15:45:00Z",
        status: "PROCESSING",
        providerName: "Quest Diagnostics",
      },
      {
        documentId: "DOC10004",
        fileName: "prescription_auth_scan.pdf",
        documentType: "Prescription",
        uploadedAt: "2026-08-17T16:10:00Z",
        status: "INVALID",
        rejectionReason: "Information provided in the document could not be verified with the provider.",
        providerName: "Cleveland Clinic Network",
      },
      {
        documentId: "DOC10005",
        fileName: "stanford_radiology_report.pdf",
        documentType: "Radiology Report",
        uploadedAt: "2026-08-17T16:30:00Z",
        status: "VERIFICATION_PENDING",
        providerName: "Stanford Health Care",
      },
    ];
  }
}
