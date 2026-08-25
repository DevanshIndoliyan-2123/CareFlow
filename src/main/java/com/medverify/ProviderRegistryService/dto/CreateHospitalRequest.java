package com.medverify.ProviderRegistryService.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateHospitalRequest(

        @NotBlank
        String name,

        String identifier,

        String address,

        String city,

        String state,

        String country,

        String postalCode,

        String fhirEndpoint
) {
}
