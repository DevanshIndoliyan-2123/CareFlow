package com.medverify.document_service.entity;

public enum DocumentStatus {
    UPLOADED,

    PROCESSING,

    EXTRACTED,

    VERIFICATION_PENDING,

    VERIFIED,

    INVALID,

    FAILED
}
