package com.medverify.ProviderRegistryService.dto;

import java.util.UUID;

public record HospitalResponse
        (
                                UUID id,
                               String name,
                               String identifier,
                               String address,
                               String city,
                               String state,
                               String country,
                               String postalCode,
                               String fhirEndpoint,
                               Boolean active) {
}
