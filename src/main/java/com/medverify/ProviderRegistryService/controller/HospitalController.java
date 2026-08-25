package com.medverify.ProviderRegistryService.controller;

import com.medverify.ProviderRegistryService.dto.CreateHospitalRequest;
import com.medverify.ProviderRegistryService.dto.HospitalResponse;
import com.medverify.ProviderRegistryService.service.HospitalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/hospitals")
@RequiredArgsConstructor
public class HospitalController {
    private final HospitalService hospitalService;

    @PostMapping
    public ResponseEntity<HospitalResponse> create(
            @Valid
            @RequestBody
            CreateHospitalRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        hospitalService.create(request)
                );
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalResponse> getById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                hospitalService.getById(id)
        );
    }
    @GetMapping("/search")
    public ResponseEntity<List<HospitalResponse>>
    search(
            @RequestParam(required = false)
            String name,

            @RequestParam(required = false)
            String city,

            @RequestParam(required = false)
            String state
    ) {

        return ResponseEntity.ok(
                hospitalService.search(
                        name,
                        city,
                        state
                )
        );
    }
}
