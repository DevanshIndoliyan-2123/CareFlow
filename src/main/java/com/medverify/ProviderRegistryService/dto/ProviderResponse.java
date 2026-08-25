package com.medverify.ProviderRegistryService.dto;

import java.util.UUID;

public record ProviderResponse(
        UUID id,

        String npi,

        String name,

        String firstName,

        String lastName,

        String specialty,

        String licenseNumber,

        String state,

        UUID hospitalId,

        String hospitalName,

        String fhirEndpoint,

        Boolean npiValidated,

        Boolean active
) {
}
