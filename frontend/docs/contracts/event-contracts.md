# Event Contracts & Asynchronous Pipeline Specification

This document defines the Kafka event schemas and topic contracts between backend microservices and worker nodes.

> **FRONTEND BOUNDARY NOTE (Member 3):**  
> The React frontend does **not** connect directly to Kafka brokers.  
> The frontend only queries the API Gateway via REST (`GET /documents/{id}/status`).  
> Internal Kafka event streaming is managed by Member 2 and consumed by Member 1.

---

## 1. Producer / Consumer Responsibility Matrix

| Topic Name | Producer | Consumer | Description |
| :--- | :--- | :--- | :--- |
| **`document.uploaded`** | Member 2 (Ingestion Service) | Member 1 (Python AI Worker) | Triggered when a new PDF is stored in S3/MinIO. |
| **`document.extracted`** | Member 1 (Python AI Worker) | Member 2 (Provider Matcher) | Published when OCR & NER clinical extraction finishes. |
| **`provider.matched`** | Member 2 (Provider Matcher) | Member 2 (Verification Service)| Published when doctor/hospital NPI is verified. |
| **`document.verified`** | Member 2 (Verification Service) | Member 2 (Status Store / Gateway) | Final event when hospital EMR records match. |
| **`document.invalid`** | Member 2 (Verification Service) | Member 2 (Status Store / Gateway) | Final event when record mismatch or fraud detected. |

---

## 2. Event Payload Schemas

### 1. `document.uploaded`
```json
{
  "eventId": "evt-78901",
  "eventType": "DOCUMENT_UPLOADED",
  "documentId": "DOC10001",
  "timestamp": "2026-08-17T15:30:00Z",
  "fileUrl": "s3://careflow-docs/DOC10001/medical-report.pdf",
  "fileSize": 1048576,
  "mimeType": "application/pdf"
}
```

### 2. `document.extracted`
Published by Member 1 (Python AI Service):
```json
{
  "eventId": "evt-78902",
  "eventType": "DOCUMENT_EXTRACTED",
  "documentId": "DOC10001",
  "timestamp": "2026-08-17T15:30:03Z",
  "extractedData": {
    "patientName": "Jane Doe",
    "dob": "1988-04-12",
    "providerName": "Mayo Clinic Rochester",
    "providerNpi": "1234567890",
    "documentType": "Diagnostic Lab Report",
    "diagnosisCodes": ["E11.9", "I10"],
    "confidenceScore": 0.98
  }
}
```

### 3. `provider.matched`
Published by Member 2 (Provider Service):
```json
{
  "eventId": "evt-78903",
  "eventType": "PROVIDER_MATCHED",
  "documentId": "DOC10001",
  "timestamp": "2026-08-17T15:30:05Z",
  "provider": {
    "providerId": "PRV-9871",
    "name": "Mayo Clinic Rochester",
    "npi": "1234567890",
    "accreditationStatus": "ACTIVE",
    "emrEndpoint": "https://emr.mayo.edu/fhir/r4"
  }
}
```

### 4. `document.verified` (Success Verdict)
```json
{
  "eventId": "evt-78904",
  "eventType": "DOCUMENT_VERIFIED",
  "documentId": "DOC10001",
  "timestamp": "2026-08-17T15:30:08Z",
  "status": "VERIFIED",
  "verificationDetails": {
    "verifiedWith": "Mayo Clinic EMR FHIR Gateway",
    "matchConfidence": 1.0,
    "verifiedAt": "2026-08-17T15:30:08Z"
  }
}
```

### 5. `document.invalid` (Rejection Verdict)
```json
{
  "eventId": "evt-78905",
  "eventType": "DOCUMENT_INVALID",
  "documentId": "DOC10001",
  "timestamp": "2026-08-17T15:30:08Z",
  "status": "INVALID",
  "rejectionReason": "Information provided in the document could not be verified with the provider."
}
```

---

## 3. End-to-End Flow Summary

```
[Member 3: React Frontend]
       │
       ▼ (POST /documents)
[Member 2: API Gateway] ──(Stores File)──> [S3 / MinIO]
       │
       ▼ (Publish: document.uploaded)
    [Kafka]
       │
       ▼ (Consume)
[Member 1: Python AI Worker] ──(OCR / Extraction)
       │
       ▼ (Publish: document.extracted)
    [Kafka]
       │
       ▼ (Consume)
[Member 2: Java Spring Boot Services] ──(EMR Check & Verification)
       │
       ▼ (Updates Status in Database)
[Member 3: React Frontend] <──(GET /documents/{id}/status polling)── [API Gateway]
```
