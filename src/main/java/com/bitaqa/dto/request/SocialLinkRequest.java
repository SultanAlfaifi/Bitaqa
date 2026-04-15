package com.bitaqa.dto.request;

import com.bitaqa.domain.enums.SocialPlatform;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialLinkRequest {

    @NotNull(message = "Platform is required")
    private SocialPlatform platform;

    @NotBlank(message = "URL is required")
    @Size(max = 500, message = "URL must not exceed 500 characters")
    private String url;

    @Size(max = 100, message = "Label must not exceed 100 characters")
    private String label;
}
