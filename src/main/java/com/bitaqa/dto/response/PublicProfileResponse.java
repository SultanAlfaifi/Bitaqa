package com.bitaqa.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PublicProfileResponse {
    private String username;
    private String displayName;
    private String bio;
    private String avatarUrl;
    private String specialization;
    private String location;
    private String websiteUrl;
    private Long viewCount;
    private List<SkillResponse> skills;
    private List<ProjectResponse> projects;
    private List<SocialLinkResponse> socialLinks;
}
