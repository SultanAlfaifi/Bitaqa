package com.bitaqa.service;

import com.bitaqa.domain.entity.Profile;
import com.bitaqa.domain.entity.SocialLink;
import com.bitaqa.dto.request.SocialLinkRequest;
import com.bitaqa.dto.response.SocialLinkResponse;
import com.bitaqa.exception.LimitExceededException;
import com.bitaqa.exception.ResourceNotFoundException;
import com.bitaqa.repository.SocialLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SocialLinkService {

    private final SocialLinkRepository socialLinkRepository;
    private final ProfileService profileService;

    @Value("${app.profile.max-links:10}")
    private int maxLinks;

    @Transactional(readOnly = true)
    public List<SocialLinkResponse> getLinks(Long userId) {
        Profile profile = profileService.getProfileByUserId(userId);
        return socialLinkRepository.findAllByProfileId(profile.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SocialLinkResponse addLink(Long userId, SocialLinkRequest request) {
        Profile profile = profileService.getProfileByUserId(userId);

        int count = socialLinkRepository.countByProfileId(profile.getId());
        if (count >= maxLinks) {
            throw new LimitExceededException("Maximum number of links (" + maxLinks + ") reached");
        }

        SocialLink link = SocialLink.builder()
                .platform(request.getPlatform())
                .url(request.getUrl())
                .label(request.getLabel())
                .profile(profile)
                .build();
        link = socialLinkRepository.save(link);
        return toResponse(link);
    }

    @Transactional
    public SocialLinkResponse updateLink(Long userId, Long linkId, SocialLinkRequest request) {
        Profile profile = profileService.getProfileByUserId(userId);
        SocialLink link = socialLinkRepository.findByIdAndProfileId(linkId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Social link not found with id: " + linkId));

        link.setPlatform(request.getPlatform());
        link.setUrl(request.getUrl());
        if (request.getLabel() != null) link.setLabel(request.getLabel());

        link = socialLinkRepository.save(link);
        return toResponse(link);
    }

    @Transactional
    public void deleteLink(Long userId, Long linkId) {
        Profile profile = profileService.getProfileByUserId(userId);
        SocialLink link = socialLinkRepository.findByIdAndProfileId(linkId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Social link not found with id: " + linkId));
        socialLinkRepository.delete(link);
    }

    private SocialLinkResponse toResponse(SocialLink link) {
        return SocialLinkResponse.builder()
                .id(link.getId())
                .platform(link.getPlatform())
                .url(link.getUrl())
                .label(link.getLabel())
                .build();
    }
}
