package com.medverify.ProviderRegistryService.service;

import com.medverify.ProviderRegistryService.client.NpiRegistryClient;
import com.medverify.ProviderRegistryService.dto.NpiValidationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NpiValidationService {
    private final NpiRegistryClient npiRegistryClient;

    public NpiValidationResponse validate(String npi) {

        Map<String, Object> response =
                npiRegistryClient.findByNpi(npi);

        Object resultCount =
                response.get("result_count");

        if (resultCount == null ||
                Integer.parseInt(
                        resultCount.toString()
                ) == 0) {

            return new NpiValidationResponse(
                    npi,
                    false,
                    null,
                    null,
                    null,
                    "NPI was not found in NPPES registry"
            );
        }

        List<Map<String, Object>> results =
                (List<Map<String, Object>>)
                        response.get("results");

        Map<String, Object> result =
                results.get(0);

        Map<String, Object> basic =(Map<String, Object>)
                result.get("basic");

        String firstName =
                basic != null
                        ? (String) basic.get("first_name")
                        : null;

        String lastName =
                basic != null
                        ? (String) basic.get("last_name")
                        : null;

        String organizationName =
                basic != null
                        ? (String) basic.get("organization_name")
                        : null;

        String providerName;

        if (organizationName != null &&
                !organizationName.isBlank()) {

            providerName = organizationName;

        } else {

            providerName =
                    ((firstName != null
                            ? firstName
                            : "") + " " +
                            (lastName != null
                                    ? lastName
                                    : "")).trim();
        }

        String specialty = null;

        List<Map<String, Object>> taxonomies =
                (List<Map<String, Object>>)
                        result.get("taxonomies");

        if (taxonomies != null &&
                !taxonomies.isEmpty()) {

            Map<String, Object> taxonomy =
                    taxonomies.get(0);

            specialty =
                    (String) taxonomy.get(
                            "desc"
                    );
        }

        String state = null;

        if (basic != null) {

            state =
                    (String) basic.get(
                            "state"  );
        }

        return new NpiValidationResponse(
                npi,
                true,
                providerName,
                specialty,
                state,
                "NPI is valid"
        );
    }
}
