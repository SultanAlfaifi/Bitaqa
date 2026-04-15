package com.bitaqa.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AnalyticsSummaryResponse {
    private long totalViews;
    private long viewsLast7Days;
    private long viewsLast30Days;
    private List<DailyViewEntry> dailyViews;

    @Getter
    @Builder
    public static class DailyViewEntry {
        private String date;
        private long views;
    }
}
