package com.bitaqa.dto.response;

import com.bitaqa.domain.enums.SocialPlatform;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SocialLinkResponse {
    private Long id;
    private SocialPlatform platform;
    private String url;
    private String label;
}
