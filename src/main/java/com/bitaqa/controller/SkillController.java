package com.bitaqa.controller;

import com.bitaqa.dto.request.SkillRequest;
import com.bitaqa.dto.response.SkillResponse;
import com.bitaqa.security.BitaqaUserDetails;
import com.bitaqa.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/profile/me/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    public ResponseEntity<List<SkillResponse>> getSkills(
            @AuthenticationPrincipal BitaqaUserDetails userDetails) {
        return ResponseEntity.ok(skillService.getSkills(userDetails.getUserId()));
    }

    @PostMapping
    public ResponseEntity<SkillResponse> addSkill(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @Valid @RequestBody SkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                skillService.addSkill(userDetails.getUserId(), request));
    }

    @PutMapping("/{skillId}")
    public ResponseEntity<SkillResponse> updateSkill(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @PathVariable Long skillId,
            @Valid @RequestBody SkillRequest request) {
        return ResponseEntity.ok(skillService.updateSkill(userDetails.getUserId(), skillId, request));
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<Void> deleteSkill(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @PathVariable Long skillId) {
        skillService.deleteSkill(userDetails.getUserId(), skillId);
        return ResponseEntity.noContent().build();
    }
}
