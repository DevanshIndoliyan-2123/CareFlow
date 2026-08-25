package com.medverify.ProviderRegistryService.service;

import com.medverify.ProviderRegistryService.dto.CreateHospitalRequest;
import com.medverify.ProviderRegistryService.dto.HospitalResponse;
import com.medverify.ProviderRegistryService.entity.Hospital;
import com.medverify.ProviderRegistryService.exception.ResourceNotFoundException;
import com.medverify.ProviderRegistryService.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HospitalService {
    private final HospitalRepository hospitalRepository;

    public HospitalResponse create(
            CreateHospitalRequest request
    ) {

        Hospital hospital = Hospital.builder()
                .name(request.name())
                .identifier(request.identifier())
                .address(request.address())
                .city(request.city())
                .state(request.state())
                .country(request.country())
                .postalCode(request.postalCode())
                .fhirEndpoint(request.fhirEndpoint())
                .active(true)
                .build();

        return map(
                hospitalRepository.save(hospital)
        );
    }

    public HospitalResponse getById(UUID id) {

        Hospital hospital = hospitalRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hospital not found: " + id
                        )
                );return map(hospital);
    }

    public List<HospitalResponse> search(
            String name,
            String city,
            String state
    ) {

        List<Hospital> hospitals;

        if (name != null && !name.isBlank()) {

            hospitals =
                    hospitalRepository
                            .findByNameContainingIgnoreCase(name);

        } else if (city != null && !city.isBlank()) {

            hospitals =
                    hospitalRepository
                            .findByCityContainingIgnoreCase(city);

        } else if (state != null && !state.isBlank()) {

            hospitals =
                    hospitalRepository
                            .findByStateIgnoreCase(state);

        } else {

            hospitals =
                    hospitalRepository.findAll();
        } return hospitals
                .stream()
                .map(this::map)
                .toList();
    }

    private HospitalResponse map(Hospital hospital) {

        return new HospitalResponse(
                hospital.getId(),
                hospital.getName(),
                hospital.getIdentifier(),
                hospital.getAddress(),
                hospital.getCity(),
                hospital.getState(),
                hospital.getCountry(),
                hospital.getPostalCode(),
                hospital.getFhirEndpoint(),
                hospital.getActive()
        );
    }
}
