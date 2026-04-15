package com.bitaqa.dto.response;

import com.bitaqa.domain.enums.SkillLevel;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SkillResponse {
    private Long id;
    private String name;
    private SkillLevel level;
}
