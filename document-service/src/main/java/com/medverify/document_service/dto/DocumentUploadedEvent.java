package com.medverify.document_service.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record DocumentUploadedEvent(
        UUID documentId,

        UUID userId,

        String originalFilename,

        String contentType,

        Long fileSize,

        String storagePath,

        LocalDateTime uploadedAt
) {
}
