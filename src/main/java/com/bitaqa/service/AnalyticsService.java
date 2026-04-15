package com.bitaqa.service;

import com.bitaqa.domain.entity.Profile;
import com.bitaqa.domain.entity.ProfileView;
import com.bitaqa.dto.response.AnalyticsSummaryResponse;
import com.bitaqa.repository.ProfileRepository;
import com.bitaqa.repository.ProfileViewRepository;
import com.bitaqa.util.IpExtractorUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ProfileViewRepository profileViewRepository;
    private final ProfileRepository profileRepository;
    private final ProfileService profileService;

    @Value("${app.analytics.dedup-window-minutes:60}")
    private int dedupWindowMinutes;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Transactional
    public void recordView(Long profileId, HttpServletRequest request) {
        String rawIp = IpExtractorUtil.extractIp(request);
        String hashedIp = IpExtractorUtil.hashIp(rawIp);

        LocalDateTime dedupCutoff = LocalDateTime.now().minusMinutes(dedupWindowMinutes);
        boolean isDuplicate = profileViewRepository.existsByProfileIdAndIpAddressAndViewedAtAfter(
                profileId, hashedIp, dedupCutoff);

        if (!isDuplicate) {
            String userAgent = request.getHeader("User-Agent");
            if (userAgent != null && userAgent.length() > 255) {
                userAgent = userAgent.substring(0, 255);
            }

            ProfileView view = ProfileView.builder()
                    .ipAddress(hashedIp)
                    .userAgent(userAgent)
                    .viewedAt(LocalDateTime.now())
                    .profile(Profile.builder().id(profileId).build())
                    .build();
            profileViewRepository.save(view);
            profileRepository.incrementViewCount(profileId);
        }
    }

    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse getSummary(Long userId) {
        Profile profile = profileService.getProfileByUserId(userId);
        Long profileId = profile.getId();

        long totalViews = profileViewRepository.countByProfileId(profileId);
        LocalDateTime now = LocalDateTime.now();
        long views7Days = profileViewRepository.countByProfileIdAndViewedAtBetween(
                profileId, now.minusDays(7), now);
        long views30Days = profileViewRepository.countByProfileIdAndViewedAtBetween(
                profileId, now.minusDays(30), now);

        return AnalyticsSummaryResponse.builder()
                .totalViews(totalViews)
                .viewsLast7Days(views7Days)
                .viewsLast30Days(views30Days)
                .build();
    }

    @Transactional(readOnly = true)
    public AnalyticsSummaryResponse getDailyViews(Long userId, int days) {
        if (days < 1) days = 1;
        if (days > 365) days = 365;

        Profile profile = profileService.getProfileByUserId(userId);
        Long profileId = profile.getId();

        LocalDateTime since = LocalDateTime.now().minusDays(days);
        List<Object[]> rows = profileViewRepository.getDailyViewsForProfile(profileId, since);

        List<AnalyticsSummaryResponse.DailyViewEntry> entries = new ArrayList<>();
        for (Object[] row : rows) {
            String date = row[0].toString();
            long count = ((Number) row[1]).longValue();
            entries.add(AnalyticsSummaryResponse.DailyViewEntry.builder()
                    .date(date)
                    .views(count)
                    .build());
        }

        LocalDateTime now = LocalDateTime.now();
        long totalViews = profileViewRepository.countByProfileId(profileId);
        long views7Days = profileViewRepository.countByProfileIdAndViewedAtBetween(
                profileId, now.minusDays(7), now);
        long views30Days = profileViewRepository.countByProfileIdAndViewedAtBetween(
                profileId, now.minusDays(30), now);

        return AnalyticsSummaryResponse.builder()
                .totalViews(totalViews)
                .viewsLast7Days(views7Days)
                .viewsLast30Days(views30Days)
                .dailyViews(entries)
                .build();
    }
}
