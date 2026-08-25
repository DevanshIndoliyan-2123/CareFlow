package com.medverify.ProviderRegistryService.repository;

import com.medverify.ProviderRegistryService.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HospitalRepository
        extends JpaRepository<Hospital, UUID> {

    List<Hospital> findByNameContainingIgnoreCase(String name);

    List<Hospital> findByCityContainingIgnoreCase(String city);

    List<Hospital> findByStateIgnoreCase(String state);

    boolean existsByIdentifier(String identifier);
}