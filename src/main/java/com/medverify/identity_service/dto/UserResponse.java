package com.medverify.identity_service.dto;

import com.medverify.identity_service.entity.Role;
import com.medverify.identity_service.entity.User;
import java.time.Instant;
import java.util.UUID;

public record UserResponse(
                            UUID id,

                           String firstName,

                           String lastName,

                           String email,

                           Role role,

                           boolean enabled,

                           Instant createdAt)
{
    public static UserResponse from(User user) {

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt()
        );
    }
}
