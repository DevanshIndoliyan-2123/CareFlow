package com.medverify.ProviderRegistryService.dto;

public record NpiValidationResponse(
        String npi,

        boolean valid,

        String providerName,

        String specialty,

        String state,

        String message
) {
}
