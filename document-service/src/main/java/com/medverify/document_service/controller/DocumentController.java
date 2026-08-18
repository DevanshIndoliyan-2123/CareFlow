package com.medverify.document_service.controller;

import com.medverify.document_service.dto.DocumentResponse;
import com.medverify.document_service.service.DocumentService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(
            DocumentService documentService
    ) {
        this.documentService = documentService;
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<DocumentResponse> uploadDocument(

            @RequestParam UUID userId,

            @RequestParam("file")
            MultipartFile file

    ) throws IOException {

        DocumentResponse response =
                documentService.uploadDocument(
                        userId,
                        file
                );

        return ResponseEntity
                .status(201)
                .body(response);
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<DocumentResponse> getDocument(
            @PathVariable UUID documentId
    ) {

        return ResponseEntity.ok(
                documentService.getDocument(
                        documentId
                )
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DocumentResponse>>
    getUserDocuments(
            @PathVariable UUID userId
    ) {

        return ResponseEntity.ok(
                documentService.getUserDocuments(
                        userId
                )
        );
    }
    @GetMapping("/{documentId}/download")
    public ResponseEntity<ByteArrayResource>
    downloadDocument(
            @PathVariable UUID documentId
    ) throws IOException {

        byte[] data =
                documentService.downloadDocument(
                        documentId
                );

        DocumentResponse document =
                documentService.getDocument(
                        documentId
                );

        ByteArrayResource resource =
                new ByteArrayResource(data);

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(
                                document.originalFilename()
                        )
                        .build()
        );

        headers.setContentType(
                MediaType.parseMediaType(
                        document.contentType()
                )
        );

        headers.setContentLength(data.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }


}
