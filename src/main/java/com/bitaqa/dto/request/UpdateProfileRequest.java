package com.bitaqa.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
public class UpdateProfileRequest {

    @Size(max = 100, message = "Display name must not exceed 100 characters")
    private String displayName;

    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;

    @Size(max = 500, message = "Avatar URL must not exceed 500 characters")
    private String avatarUrl;

    @Size(max = 100, message = "Specialization must not exceed 100 characters")
    private String specialization;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @Size(max = 500, message = "Website URL must not exceed 500 characters")
    private String websiteUrl;
}
