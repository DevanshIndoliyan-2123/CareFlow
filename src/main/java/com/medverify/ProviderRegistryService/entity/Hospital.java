package com.medverify.ProviderRegistryService.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(
        name = "hospitals",
        indexes = {
                @Index(name = "idx_hospital_name", columnList = "name")
        }
)
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String identifier;

    private String address;

    private String city;

    private String state;

    private String country;

    private String postalCode;

    @Column(name = "fhir_endpoint")
    private String fhirEndpoint;

    @Builder.Default
    private Boolean active = true;
}
