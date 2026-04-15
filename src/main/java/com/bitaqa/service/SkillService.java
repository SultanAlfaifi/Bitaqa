package com.bitaqa.service;

import com.bitaqa.domain.entity.Profile;
import com.bitaqa.domain.entity.Skill;
import com.bitaqa.dto.request.SkillRequest;
import com.bitaqa.dto.response.SkillResponse;
import com.bitaqa.exception.LimitExceededException;
import com.bitaqa.exception.ResourceNotFoundException;
import com.bitaqa.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final ProfileService profileService;

    @Value("${app.profile.max-skills:30}")
    private int maxSkills;

    @Transactional(readOnly = true)
    public List<SkillResponse> getSkills(Long userId) {
        Profile profile = profileService.getProfileByUserId(userId);
        return skillRepository.findAllByProfileId(profile.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillResponse addSkill(Long userId, SkillRequest request) {
        Profile profile = profileService.getProfileByUserId(userId);

        int count = skillRepository.countByProfileId(profile.getId());
        if (count >= maxSkills) {
            throw new LimitExceededException("Maximum number of skills (" + maxSkills + ") reached");
        }

        Skill skill = Skill.builder()
                .name(request.getName())
                .level(request.getLevel())
                .profile(profile)
                .build();
        skill = skillRepository.save(skill);
        return toResponse(skill);
    }

    @Transactional
    public SkillResponse updateSkill(Long userId, Long skillId, SkillRequest request) {
        Profile profile = profileService.getProfileByUserId(userId);
        Skill skill = skillRepository.findByIdAndProfileId(skillId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));

        skill.setName(request.getName());
        skill.setLevel(request.getLevel());
        skill = skillRepository.save(skill);
        return toResponse(skill);
    }

    @Transactional
    public void deleteSkill(Long userId, Long skillId) {
        Profile profile = profileService.getProfileByUserId(userId);
        Skill skill = skillRepository.findByIdAndProfileId(skillId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));
        skillRepository.delete(skill);
    }

    private SkillResponse toResponse(Skill skill) {
        return SkillResponse.builder()
                .id(skill.getId())
                .name(skill.getName())
                .level(skill.getLevel())
                .build();
    }
}
