package com.bitaqa.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUsernameRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    @Pattern(regexp = "^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$",
             message = "Username must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen")
    private String username;
}
