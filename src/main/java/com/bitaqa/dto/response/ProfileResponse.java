package com.bitaqa.dto.response;

import com.bitaqa.domain.enums.ProfileVisibility;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ProfileResponse {
    private Long id;
    private String username;
    private String displayName;
    private String bio;
    private String avatarUrl;
    private String specialization;
    private String location;
    private String websiteUrl;
    private ProfileVisibility visibility;
    private Long viewCount;
    private List<SkillResponse> skills;
    private List<ProjectResponse> projects;
    private List<SocialLinkResponse> socialLinks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
