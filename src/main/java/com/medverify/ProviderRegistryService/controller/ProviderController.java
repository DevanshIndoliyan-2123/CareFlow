package com.medverify.ProviderRegistryService.controller;


import com.medverify.ProviderRegistryService.dto.CreateProviderRequest;
import com.medverify.ProviderRegistryService.dto.NpiValidationResponse;
import com.medverify.ProviderRegistryService.dto.ProviderResponse;
import com.medverify.ProviderRegistryService.service.NpiValidationService;
import com.medverify.ProviderRegistryService.service.ProviderService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/providers")
@AllArgsConstructor
public class ProviderController {
    private final ProviderService providerService;

    private final NpiValidationService npiValidationService;

    @PostMapping
    public ResponseEntity<ProviderResponse> create(
            @Valid
            @RequestBody
            CreateProviderRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        providerService.create(request)
                );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderResponse> getById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                providerService.getById(id)
        );
    }
    @GetMapping("/npi/{npi}")
    public ResponseEntity<ProviderResponse> getByNpi(
            @PathVariable String npi
    ) {

        return ResponseEntity.ok(
                providerService.getByNpi(npi)
        );
    }

    @GetMapping("/npi/{npi}/validate")
    public ResponseEntity<NpiValidationResponse>
    validateNpi(
            @PathVariable String npi
    ) {

        return ResponseEntity.ok(
                npiValidationService.validate(npi)
        );
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<ProviderResponse>
    validateProviderNpi(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                providerService.validateNpi(id)
        );
    }
    @GetMapping("/search")
    public ResponseEntity<List<ProviderResponse>>
    search(
            @RequestParam String name
    ) {

        return ResponseEntity.ok(
                providerService.searchByName(name)
        );
    }
}
