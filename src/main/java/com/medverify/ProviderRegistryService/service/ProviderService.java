package com.medverify.ProviderRegistryService.service;

import com.medverify.ProviderRegistryService.dto.CreateProviderRequest;
import com.medverify.ProviderRegistryService.dto.ProviderResponse;
import com.medverify.ProviderRegistryService.entity.Hospital;
import com.medverify.ProviderRegistryService.entity.Provider;
import com.medverify.ProviderRegistryService.exception.ResourceNotFoundException;
import com.medverify.ProviderRegistryService.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import com.medverify.ProviderRegistryService.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProviderService {
    private final ProviderRepository providerRepository;

    private final HospitalRepository hospitalRepository;

    private final NpiValidationService npiValidationService;

    public ProviderResponse create(
            CreateProviderRequest request
    ) {

        if (providerRepository.existsByNpi(
                request.npi()
        )) {

            throw new IllegalArgumentException(
                    "Provider with NPI already exists"
            );
        }

        Hospital hospital = null;

        if (request.hospitalId() != null) {
            hospital = hospitalRepository
                    .findById(request.hospitalId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Hospital not found: " +
                                            request.hospitalId()
                            )
                    );
        }

        Provider provider = Provider.builder()
                .npi(request.npi())
                .name(request.name())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .specialty(request.specialty())
                .licenseNumber(request.licenseNumber())
                .state(request.state())
                .hospital(hospital)
                .fhirEndpoint(
                        request.fhirEndpoint()
                )
                .npiValidated(false)
                .active(true)
                .build();

        return map(
                providerRepository.save(provider)
        );
    }

    public ProviderResponse getById(UUID id) {
        Provider provider =
                providerRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Provider not found: " + id
                                )
                        );

        return map(provider);
    }

    public ProviderResponse getByNpi(
            String npi
    ) {

        Provider provider =
                providerRepository
                        .findByNpi(npi)
                        .orElse(null);

        if (provider != null) {
            return map(provider);
        }

        /*
         * Provider isn't in local registry.
         *
         * We can validate the NPI externally.
         * We don't automatically create the provider
         * because external registry data shouldn't
         * silently become local authoritative data.
         */
        var validation =
                npiValidationService.validate(npi);

        if (!validation.valid()) {

            throw new ResourceNotFoundException(
                    "Provider with NPI " +
                            npi +
                            " was not found"
            );
        }

        throw new ResourceNotFoundException(
                "Valid NPI found externally, " +
                        "but provider is not registered locally"
        );
    }

    public ProviderResponse validateNpi(
            UUID providerId
    ) {

        Provider provider =
                providerRepository.findById(providerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Provider not found: " +
                                                providerId
                                )
                        );
        var validation =
                npiValidationService.validate(
                        provider.getNpi()
                );

        provider.setNpiValidated(
                validation.valid()
        );

        providerRepository.save(provider);

        return map(provider);
    }

    public List<ProviderResponse> searchByName(
            String name
    ) {

        return providerRepository
                .findAll()
                .stream()
                .filter(provider ->
                        provider.getName()
                                .toLowerCase()
                                .contains(
                                        name.toLowerCase()
                                )
                )
                .map(this::map)
                .toList();
    }

    private ProviderResponse map(
            Provider provider
    ) {

        Hospital hospital =
                provider.getHospital();

        return new ProviderResponse(

                provider.getId(),

                provider.getNpi(),

                provider.getName(),

                provider.getFirstName(),

                provider.getLastName(),

                provider.getSpecialty(),

                provider.getLicenseNumber(),

                provider.getState(),

                hospital != null
                        ? hospital.getId()
                        : null,

                hospital != null
                        ? hospital.getName()
                        : null,

                provider.getFhirEndpoint(),

                provider.getNpiValidated(),

                provider.getActive()
        );
    }
    }
