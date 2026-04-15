package com.bitaqa.service;

import com.bitaqa.domain.entity.Profile;
import com.bitaqa.domain.enums.ProfileVisibility;
import com.bitaqa.dto.request.UpdateProfileRequest;
import com.bitaqa.dto.request.UpdateUsernameRequest;
import com.bitaqa.dto.request.UpdateVisibilityRequest;
import com.bitaqa.dto.response.ProfileResponse;
import com.bitaqa.dto.response.ProjectResponse;
import com.bitaqa.dto.response.SkillResponse;
import com.bitaqa.dto.response.SocialLinkResponse;
import com.bitaqa.exception.ResourceNotFoundException;
import com.bitaqa.exception.UsernameAlreadyTakenException;
import com.bitaqa.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public ProfileResponse getMyProfile(Long userId) {
        Profile profile = getProfileByUserId(userId);
        return toProfileResponse(profile);
    }

    @Transactional
    public ProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        Profile profile = getProfileByUserId(userId);

        if (request.getDisplayName() != null) profile.setDisplayName(request.getDisplayName());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getSpecialization() != null) profile.setSpecialization(request.getSpecialization());
        if (request.getLocation() != null) profile.setLocation(request.getLocation());
        if (request.getWebsiteUrl() != null) profile.setWebsiteUrl(request.getWebsiteUrl());

        profile = profileRepository.save(profile);
        return toProfileResponse(profile);
    }

    @Transactional
    public ProfileResponse updateUsername(Long userId, UpdateUsernameRequest request) {
        Profile profile = getProfileByUserId(userId);
        String newUsername = request.getUsername().toLowerCase();

        if (!profile.getUsername().equals(newUsername) && profileRepository.existsByUsername(newUsername)) {
            throw new UsernameAlreadyTakenException(newUsername);
        }

        profile.setUsername(newUsername);
        profile = profileRepository.save(profile);
        return toProfileResponse(profile);
    }

    @Transactional
    public ProfileResponse updateVisibility(Long userId, UpdateVisibilityRequest request) {
        Profile profile = getProfileByUserId(userId);
        profile.setVisibility(request.getVisibility());
        profile = profileRepository.save(profile);
        return toProfileResponse(profile);
    }

    public Profile getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user"));
    }

    public static ProfileResponse toProfileResponse(Profile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .username(profile.getUsername())
                .displayName(profile.getDisplayName())
                .bio(profile.getBio())
                .avatarUrl(profile.getAvatarUrl())
                .specialization(profile.getSpecialization())
                .location(profile.getLocation())
                .websiteUrl(profile.getWebsiteUrl())
                .visibility(profile.getVisibility())
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
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
