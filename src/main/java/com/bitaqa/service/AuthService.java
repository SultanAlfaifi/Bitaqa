package com.bitaqa.service;

import com.bitaqa.config.JwtConfig;
import com.bitaqa.domain.entity.Profile;
import com.bitaqa.domain.entity.RefreshToken;
import com.bitaqa.domain.entity.User;
import com.bitaqa.domain.enums.ProfileVisibility;
import com.bitaqa.dto.request.LoginRequest;
import com.bitaqa.dto.request.RefreshTokenRequest;
import com.bitaqa.dto.request.RegisterRequest;
import com.bitaqa.dto.response.AuthResponse;
import com.bitaqa.exception.EmailAlreadyExistsException;
import com.bitaqa.exception.InvalidTokenException;
import com.bitaqa.repository.ProfileRepository;
import com.bitaqa.repository.RefreshTokenRepository;
import com.bitaqa.repository.UserRepository;
import com.bitaqa.security.BitaqaUserDetails;
import com.bitaqa.security.JwtService;
import com.bitaqa.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtConfig jwtConfig;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        user = userRepository.save(user);

        String username = generateUniqueUsername(request.getEmail());
        Profile profile = Profile.builder()
                .username(username)
                .displayName(emailToDisplayName(request.getEmail()))
                .visibility(ProfileVisibility.PUBLIC)
                .viewCount(0L)
                .user(user)
                .build();
        profileRepository.save(profile);

        BitaqaUserDetails userDetails = new BitaqaUserDetails(user);
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshTokenValue = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .expiresIn(jwtConfig.getAccessTokenExpiry() / 1000)
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        BitaqaUserDetails userDetails = (BitaqaUserDetails) auth.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow();

        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshTokenValue = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .expiresIn(jwtConfig.getAccessTokenExpiry() / 1000)
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

        if (refreshToken.isRevoked()) {
            throw new InvalidTokenException("Refresh token has been revoked");
        }
        if (refreshToken.isExpired()) {
            throw new InvalidTokenException("Refresh token has expired");
        }

        // Rotate: revoke old, issue new
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        User user = refreshToken.getUser();
        BitaqaUserDetails userDetails = new BitaqaUserDetails(user);
        String newAccessToken = jwtService.generateAccessToken(userDetails);
        String newRefreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(jwtConfig.getAccessTokenExpiry() / 1000)
                .build();
    }

    @Transactional
    public void logout(RefreshTokenRequest request) {
        refreshTokenRepository.findByToken(request.getRefreshToken())
                .ifPresent(rt -> {
                    rt.setRevoked(true);
                    refreshTokenRepository.save(rt);
                });
    }

    @Transactional
    public void logoutAll(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
    }

    private String createRefreshToken(User user) {
        String tokenValue = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .token(tokenValue)
                .user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(jwtConfig.getRefreshTokenExpiry() / 1000))
                .build();
        refreshTokenRepository.save(refreshToken);
        return tokenValue;
    }

    private String generateUniqueUsername(String email) {
        String emailPrefix = email.split("@")[0];
        String baseSlug = SlugUtil.toSlug(emailPrefix);
        if (!profileRepository.existsByUsername(baseSlug)) {
            return baseSlug;
        }
        // Try with random suffix
        Random random = new Random();
        for (int i = 0; i < 10; i++) {
            String candidate = baseSlug + "-" + (1000 + random.nextInt(9000));
            if (!profileRepository.existsByUsername(candidate)) {
                return candidate;
            }
        }
        // Fallback: use UUID suffix
        return baseSlug + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    private String emailToDisplayName(String email) {
        String prefix = email.split("@")[0];
        return prefix.replace(".", " ").replace("_", " ").replace("-", " ");
    }
}
