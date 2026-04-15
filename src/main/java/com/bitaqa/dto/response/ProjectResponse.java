package com.bitaqa.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private String projectUrl;
    private String imageUrl;
    private int displayOrder;
    private LocalDateTime createdAt;
}
