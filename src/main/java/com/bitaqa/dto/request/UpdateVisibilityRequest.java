package com.bitaqa.dto.request;

import com.bitaqa.domain.enums.ProfileVisibility;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateVisibilityRequest {

    @NotNull(message = "Visibility is required")
    private ProfileVisibility visibility;
}
