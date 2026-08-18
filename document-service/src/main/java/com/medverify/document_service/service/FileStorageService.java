package com.medverify.document_service.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path storageLocation;

    public FileStorageService(
            @Value("${document.storage.location}") String storageLocation
    ) throws IOException {

        this.storageLocation =
                Paths.get(storageLocation)
                        .toAbsolutePath()
                        .normalize();

        Files.createDirectories(this.storageLocation);
    }

    public String store(
            MultipartFile file,
            UUID documentId
    ) throws IOException {

        String extension = getExtension(
                file.getOriginalFilename()
        );

        String storedFilename =
                documentId + extension;

        Path targetLocation =
                storageLocation.resolve(storedFilename)
                        .normalize();

        if (!targetLocation.startsWith(storageLocation)) {
            throw new IOException("Invalid file path");
        }
        Files.copy(
                file.getInputStream(),
                targetLocation,
                StandardCopyOption.REPLACE_EXISTING
        );

        return storedFilename;
    }

    public byte[] load(String storedFilename)
            throws IOException {

        Path filePath =
                storageLocation
                        .resolve(storedFilename)
                        .normalize();

        if (!filePath.startsWith(storageLocation)) {
            throw new IOException("Invalid file path");
        }

        return Files.readAllBytes(filePath);
    }

    public void delete(String storedFilename)
            throws IOException {

        Path filePath =
                storageLocation
                        .resolve(storedFilename)
                        .normalize();

        Files.deleteIfExists(filePath);
    }

    private String getExtension(String filename) {

        if (filename == null || filename.isBlank()) {
            return "";
        }

        int index = filename.lastIndexOf('.');

        if (index == -1) {
            return "";
        }

        return filename.substring(index)
                .toLowerCase();
    }
}
