package com.medverify.document_service.service;

import com.medverify.document_service.dto.DocumentUploadedEvent;
import com.medverify.document_service.dto.DocumentResponse;
import com.medverify.document_service.entity.Document;
import com.medverify.document_service.entity.DocumentStatus;
import com.medverify.document_service.exception.DocumentNotFoundException;
import com.medverify.document_service.repository.DocumentRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.medverify.document_service.dto.DocumentResponse;
import org.springframework.stereotype.Service;

@Service
public class DocumentService {


    private final DocumentRepository documentRepository;
    private final FileStorageService fileStorageService;
    private final KafkaTemplate<String, DocumentUploadedEvent> kafkaTemplate;

    private final String documentUploadedTopic;

    public DocumentService(
            DocumentRepository documentRepository,
            FileStorageService fileStorageService,
            KafkaTemplate<String, DocumentUploadedEvent> kafkaTemplate,
            @Value("${kafka.topics.document-uploaded}")
            String documentUploadedTopic
    ) {

        this.documentRepository = documentRepository;
        this.fileStorageService = fileStorageService;
        this.kafkaTemplate = kafkaTemplate;
        this.documentUploadedTopic = documentUploadedTopic;
    }

    @Transactional
    public DocumentResponse uploadDocument(
            UUID userId,
            MultipartFile file
    ) throws IOException {

        validateFile(file);

        UUID documentId = UUID.randomUUID();

        String storedFilename =
                fileStorageService.store(
                        file,
                        documentId
                );
        Document document = new Document();

        document.setUserId(userId);
        document.setOriginalFilename(
                file.getOriginalFilename()
        );
        document.setStoredFilename(storedFilename);
        document.setContentType(
                file.getContentType()
        );
        document.setFileSize(
                file.getSize()
        );
        document.setStoragePath(
                storedFilename
        );
        document.setStatus(
                DocumentStatus.UPLOADED
        );

        Document savedDocument =
                documentRepository.save(document);

        publishDocumentUploadedEvent(savedDocument);

        return toResponse(savedDocument);
    }

    @Transactional(readOnly = true)
    public DocumentResponse getDocument(
            UUID documentId
    ) {

        Document document =
                documentRepository
                        .findById(documentId)
                        .orElseThrow(
                                () -> new DocumentNotFoundException(
                                        "Document not found: "
                                                + documentId
                                )
                        );

        return toResponse(document);
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> getUserDocuments(
            UUID userId
    ) { return documentRepository
            .findByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public byte[] downloadDocument(
            UUID documentId
    ) throws IOException {

        Document document =
                documentRepository
                        .findById(documentId)
                        .orElseThrow(
                                () -> new DocumentNotFoundException(
                                        "Document not found: "
                                                + documentId
                                )
                        );

        return fileStorageService.load(
                document.getStoredFilename()
        );
    }

    private void publishDocumentUploadedEvent(
            Document document
    ) {

        DocumentUploadedEvent event =
                new DocumentUploadedEvent(

                        document.getId(),
                        document.getUserId(),

                        document.getOriginalFilename(),

                        document.getContentType(),

                        document.getFileSize(),

                        document.getStoragePath(),

                        LocalDateTime.now()
                );

        kafkaTemplate.send(
                documentUploadedTopic,
                document.getId().toString(),
                event
        );
    }

    private void validateFile(
            MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "File cannot be empty"
            );
        }
        String contentType =
                file.getContentType();

        if (contentType == null) {
            throw new IllegalArgumentException(
                    "File content type is missing"
            );
        }

        boolean supported =
                contentType.equals("application/pdf")
                        || contentType.equals("image/jpeg")
                        || contentType.equals("image/png");

        if (!supported) {
            throw new IllegalArgumentException(
                    "Only PDF, JPEG and PNG files are supported"
            );
        }
    }

    private DocumentResponse toResponse(
            Document document
    ) {

        return new DocumentResponse(

                document.getId(),

                document.getUserId(),

                document.getOriginalFilename(),
                document.getContentType(),

                document.getFileSize(),

                document.getStatus(),

                document.getCreatedAt()
        );
    }
}
