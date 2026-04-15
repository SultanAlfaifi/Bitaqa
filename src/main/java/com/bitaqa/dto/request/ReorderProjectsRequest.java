package com.bitaqa.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReorderProjectsRequest {

    @NotEmpty(message = "Orders list must not be empty")
    @Valid
    private List<ProjectOrderItem> orders;

    @Getter
    @Setter
    public static class ProjectOrderItem {

        @NotNull(message = "Project ID is required")
        private Long projectId;

        @NotNull(message = "Display order is required")
        private Integer displayOrder;
    }
}
