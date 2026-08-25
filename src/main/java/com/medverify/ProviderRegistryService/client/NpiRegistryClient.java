package com.medverify.ProviderRegistryService.client;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class NpiRegistryClient {

    private final RestClient restClient;

    public Map<String, Object> findByNpi(String npi) {

        return restClient
                .get()
                .uri(uriBuilder ->
                        uriBuilder
                                .queryParam("version", "2.1")
                                .queryParam("number", npi)
                                .build()
                )
                .retrieve()
                .body(
                        new ParameterizedTypeReference<Map<String, Object>>() {}
                );
    }
}