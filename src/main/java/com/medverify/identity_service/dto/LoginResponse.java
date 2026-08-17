package com.medverify.identity_service.dto;

public record LoginResponse(  String accessToken,

                              String tokenType,

                              long expiresIn) {
}
