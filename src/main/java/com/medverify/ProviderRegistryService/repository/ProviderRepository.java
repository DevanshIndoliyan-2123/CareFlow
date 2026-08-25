package com.medverify.ProviderRegistryService.repository;

import com.medverify.ProviderRegistryService.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProviderRepository extends JpaRepository<Provider, UUID> {
    Optional<Provider> findByNpi(String npi);

    boolean existsByNpi(String npi);

    Optional<Provider> findByNameIgnoreCase(String name);

}
