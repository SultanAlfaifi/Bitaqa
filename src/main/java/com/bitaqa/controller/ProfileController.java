package com.bitaqa.controller;

import com.bitaqa.dto.request.UpdateProfileRequest;
import com.bitaqa.dto.request.UpdateUsernameRequest;
import com.bitaqa.dto.request.UpdateVisibilityRequest;
import com.bitaqa.dto.response.AnalyticsSummaryResponse;
import com.bitaqa.dto.response.ProfileResponse;
import com.bitaqa.security.BitaqaUserDetails;
import com.bitaqa.service.AnalyticsService;
import com.bitaqa.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final AnalyticsService analyticsService;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(
            @AuthenticationPrincipal BitaqaUserDetails userDetails) {
        return ResponseEntity.ok(profileService.getMyProfile(userDetails.getUserId()));
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateProfile(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(userDetails.getUserId(), request));
    }

    @PatchMapping("/me/username")
    public ResponseEntity<ProfileResponse> updateUsername(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @Valid @RequestBody UpdateUsernameRequest request) {
        return ResponseEntity.ok(profileService.updateUsername(userDetails.getUserId(), request));
    }

    @PatchMapping("/me/visibility")
    public ResponseEntity<ProfileResponse> updateVisibility(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @Valid @RequestBody UpdateVisibilityRequest request) {
        return ResponseEntity.ok(profileService.updateVisibility(userDetails.getUserId(), request));
    }

    @GetMapping("/me/analytics")
    public ResponseEntity<AnalyticsSummaryResponse> getAnalytics(
            @AuthenticationPrincipal BitaqaUserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getSummary(userDetails.getUserId()));
    }

    @GetMapping("/me/analytics/daily")
    public ResponseEntity<AnalyticsSummaryResponse> getDailyAnalytics(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(analyticsService.getDailyViews(userDetails.getUserId(), days));
    }
}
