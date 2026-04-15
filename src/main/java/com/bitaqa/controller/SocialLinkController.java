package com.bitaqa.controller;

import com.bitaqa.dto.request.SocialLinkRequest;
import com.bitaqa.dto.response.SocialLinkResponse;
import com.bitaqa.security.BitaqaUserDetails;
import com.bitaqa.service.SocialLinkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/profile/me/links")
@RequiredArgsConstructor
public class SocialLinkController {

    private final SocialLinkService socialLinkService;

    @GetMapping
    public ResponseEntity<List<SocialLinkResponse>> getLinks(
            @AuthenticationPrincipal BitaqaUserDetails userDetails) {
        return ResponseEntity.ok(socialLinkService.getLinks(userDetails.getUserId()));
    }

    @PostMapping
    public ResponseEntity<SocialLinkResponse> addLink(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @Valid @RequestBody SocialLinkRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                socialLinkService.addLink(userDetails.getUserId(), request));
    }

    @PutMapping("/{linkId}")
    public ResponseEntity<SocialLinkResponse> updateLink(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @PathVariable Long linkId,
            @Valid @RequestBody SocialLinkRequest request) {
        return ResponseEntity.ok(socialLinkService.updateLink(userDetails.getUserId(), linkId, request));
    }

    @DeleteMapping("/{linkId}")
    public ResponseEntity<Void> deleteLink(
            @AuthenticationPrincipal BitaqaUserDetails userDetails,
            @PathVariable Long linkId) {
        socialLinkService.deleteLink(userDetails.getUserId(), linkId);
        return ResponseEntity.noContent().build();
    }
}
