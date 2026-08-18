package com.medverify.document_service.exception;

public class DocumentNotFoundException extends RuntimeException{
    public DocumentNotFoundException(
            String message
    ) {
        super(message);
    }
}
