package com.bitaqa.controller;

import com.bitaqa.dto.request.ProjectRequest;
import com.bitaqa.dto.request.ReorderProjectsRequest;
import com.bitaqa.dto.response.ProjectResponse;
import com.bitaqa.security.BitaqaUserDetails;
import com.bitaqa.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/profile/me/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @AuthenticationPrincipal BitaqaUserDetails userDetails) {
        return ResponseEntity.ok(projectService.getProjects(userDetails.getUserId()));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> addProject(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                projectService.addProject(userDetails.getUserId(), request));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(userDetails.getUserId(), projectId, request));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @PathVariable Long projectId) {
        projectService.deleteProject(userDetails.getUserId(), projectId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/reorder")
    public ResponseEntity<List<ProjectResponse>> reorderProjects(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @Valid @RequestBody ReorderProjectsRequest request) {
        return ResponseEntity.ok(projectService.reorderProjects(userDetails.getUserId(), request));
    }
}
