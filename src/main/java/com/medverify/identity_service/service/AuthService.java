package com.medverify.identity_service.service;

import com.medverify.identity_service.config.JwtConfig;
import com.medverify.identity_service.dto.LoginRequest;
import com.medverify.identity_service.dto.LoginResponse;
import com.medverify.identity_service.dto.RegisterRequest;
import com.medverify.identity_service.dto.UserResponse;
import com.medverify.identity_service.entity.Role;
import com.medverify.identity_service.entity.User;
import com.medverify.identity_service.exception.UserAlreadyExistsException;
import com.medverify.identity_service.repository.UserRepository;
import com.medverify.identity_service.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtConfig jwtConfig;


    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            JwtConfig jwtConfig
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.jwtConfig = jwtConfig;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {

        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException(
                    "A user with this email already exists"
            );
        }

        String encodedPassword =
                passwordEncoder.encode(request.password());

        User user = User.builder()
                .firstName(request.firstName().trim())
                .lastName(request.lastName().trim())
                .email(email)
                .passwordHash(encodedPassword)
                .role(Role.PATIENT)
                .enabled(true)
                .build();
        User savedUser = userRepository.save(user);

        return UserResponse.from(savedUser);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        String email = normalizeEmail(request.email());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        )
                );

        if (!user.isEnabled()) {
            throw new IllegalStateException(
                    "User account is disabled"
            );
        }

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.password(),
                        user.getPasswordHash()
                );

        if (!passwordMatches) {
            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        String accessToken = jwtService.generateToken(user);

        return new LoginResponse(
                accessToken,
                "Bearer",    jwtConfig.getExpiration()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
