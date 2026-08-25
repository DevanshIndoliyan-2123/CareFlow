package com.medverify.ProviderRegistryService.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
        name = "providers",
        indexes = {
                @Index(name = "idx_provider_npi", columnList = "npi"),
                @Index(name = "idx_provider_name", columnList = "name")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 10)
    private String npi;

    @Column(nullable = false)
    private String name;

    private String firstName;

    private String lastName;

    private String specialty;

    private String licenseNumber;

    private String state;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Column(name = "fhir_endpoint")
    private String fhirEndpoint;

    @Builder.Default
    private Boolean npiValidated = false;

    @Builder.Default
    private Boolean active = true;
}
