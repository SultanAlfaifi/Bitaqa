package com.bitaqa.service;

import com.bitaqa.domain.entity.Profile;
import com.bitaqa.domain.entity.Project;
import com.bitaqa.dto.request.ProjectRequest;
import com.bitaqa.dto.request.ReorderProjectsRequest;
import com.bitaqa.dto.response.ProjectResponse;
import com.bitaqa.exception.LimitExceededException;
import com.bitaqa.exception.ResourceNotFoundException;
import com.bitaqa.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProfileService profileService;

    @Value("${app.profile.max-projects:20}")
    private int maxProjects;

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjects(Long userId) {
        Profile profile = profileService.getProfileByUserId(userId);
        return projectRepository.findAllByProfileIdOrderByDisplayOrderAsc(profile.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponse addProject(Long userId, ProjectRequest request) {
        Profile profile = profileService.getProfileByUserId(userId);

        int count = projectRepository.countByProfileId(profile.getId());
        if (count >= maxProjects) {
            throw new LimitExceededException("Maximum number of projects (" + maxProjects + ") reached");
        }

        int nextOrder = projectRepository.findMaxDisplayOrderByProfileId(profile.getId()) + 1;

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .projectUrl(request.getProjectUrl())
                .imageUrl(request.getImageUrl())
                .displayOrder(nextOrder)
                .profile(profile)
                .build();
        project = projectRepository.save(project);
        return toResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long userId, Long projectId, ProjectRequest request) {
        Profile profile = profileService.getProfileByUserId(userId);
        Project project = projectRepository.findByIdAndProfileId(projectId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        project.setTitle(request.getTitle());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getProjectUrl() != null) project.setProjectUrl(request.getProjectUrl());
        if (request.getImageUrl() != null) project.setImageUrl(request.getImageUrl());

        project = projectRepository.save(project);
        return toResponse(project);
    }

    @Transactional
    public void deleteProject(Long userId, Long projectId) {
        Profile profile = profileService.getProfileByUserId(userId);
        Project project = projectRepository.findByIdAndProfileId(projectId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        projectRepository.delete(project);
    }

    @Transactional
    public List<ProjectResponse> reorderProjects(Long userId, ReorderProjectsRequest request) {
        Profile profile = profileService.getProfileByUserId(userId);
        Long profileId = profile.getId();

        for (ReorderProjectsRequest.ProjectOrderItem item : request.getOrders()) {
            Project project = projectRepository.findByIdAndProfileId(item.getProjectId(), profileId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Project not found with id: " + item.getProjectId()));
            project.setDisplayOrder(item.getDisplayOrder());
            projectRepository.save(project);
        }

        return projectRepository.findAllByProfileIdOrderByDisplayOrderAsc(profileId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ProjectResponse toResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .projectUrl(project.getProjectUrl())
                .imageUrl(project.getImageUrl())
                .displayOrder(project.getDisplayOrder())
                .createdAt(project.getCreatedAt())
                .build();
    }
}
