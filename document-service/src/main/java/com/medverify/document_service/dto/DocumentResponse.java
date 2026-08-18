package com.medverify.document_service.dto;

import com.medverify.document_service.entity.DocumentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record DocumentResponse(
        UUID documentId,

        UUID userId,

        String originalFilename,

        String contentType,

        Long fileSize,

        DocumentStatus status,

        LocalDateTime createdAt

) {
}
