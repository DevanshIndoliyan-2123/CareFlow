package com.medverify.ProviderRegistryService.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record CreateProviderRequest(
        @NotBlank
        @Pattern(
                regexp = "\\d{10}",
                message = "NPI must contain exactly 10 digits"
        )
        String npi,

        @NotBlank
        String name,

        String firstName,

        String lastName,

        String specialty,

        String licenseNumber,

        String state,

        UUID hospitalId,

        String fhirEndpoint
) {
}
