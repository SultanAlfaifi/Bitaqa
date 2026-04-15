package com.bitaqa.controller;

import com.bitaqa.domain.entity.Profile;
import com.bitaqa.domain.enums.ProfileVisibility;
import com.bitaqa.dto.response.ProjectResponse;
import com.bitaqa.dto.response.PublicProfileResponse;
import com.bitaqa.dto.response.SkillResponse;
import com.bitaqa.dto.response.SocialLinkResponse;
import com.bitaqa.exception.ResourceNotFoundException;
import com.bitaqa.repository.ProfileRepository;
import com.bitaqa.service.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/p")
@RequiredArgsConstructor
public class PublicProfileController {

    private final ProfileRepository profileRepository;
    private final AnalyticsService analyticsService;

    @Transactional
    @GetMapping("/{username}")
    public ResponseEntity<PublicProfileResponse> getPublicProfile(
            @PathVariable String username,
            HttpServletRequest request) {

        Profile profile = profileRepository.findByUsername(username.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        // Return 404 for private profiles to prevent enumeration
        if (profile.getVisibility() == ProfileVisibility.PRIVATE) {
            throw new ResourceNotFoundException("Profile not found");
        }

        // Record analytics asynchronously (best effort)
        try {
            analyticsService.recordView(profile.getId(), request);
        } catch (Exception ignored) {
            // Never fail a public page request due to analytics
        }

        PublicProfileResponse response = PublicProfileResponse.builder()
                .username(profile.getUsername())
                .displayName(profile.getDisplayName())
                .bio(profile.getBio())
                .avatarUrl(profile.getAvatarUrl())
                .specialization(profile.getSpecialization())
                .location(profile.getLocation())
                .websiteUrl(profile.getWebsiteUrl())
                .viewCount(profile.getViewCount())
                .skills(profile.getSkills().stream()
                        .map(s -> SkillResponse.builder()
                                .id(s.getId())
                                .name(s.getName())
                                .level(s.getLevel())
                                .build())
                        .collect(Collectors.toList()))
                .projects(profile.getProjects().stream()
                        .map(p -> ProjectResponse.builder()
                                .id(p.getId())
                                .title(p.getTitle())
                                .description(p.getDescription())
                                .projectUrl(p.getProjectUrl())
                                .imageUrl(p.getImageUrl())
                                .displayOrder(p.getDisplayOrder())
                                .createdAt(p.getCreatedAt())
                                .build())
                        .collect(Collectors.toList()))
                .socialLinks(profile.getSocialLinks().stream()
                        .map(l -> SocialLinkResponse.builder()
                                .id(l.getId())
                                .platform(l.getPlatform())
                                .url(l.getUrl())
                                .label(l.getLabel())
                                .build())
                        .collect(Collectors.toList()))
                .build();

        return ResponseEntity.ok(response);
    }
}
