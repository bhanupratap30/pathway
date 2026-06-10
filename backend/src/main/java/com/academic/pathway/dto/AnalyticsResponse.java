package com.academic.pathway.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {
    private long totalSubmissions;
    private Map<String, Long> recommendationCounts;
    private Map<String, Long> qualificationCounts;
    private List<MonthlySubmissions> monthlySubmissions;

    // Default constructor
    public AnalyticsResponse() {}

    // All-args constructor
    public AnalyticsResponse(long totalSubmissions, Map<String, Long> recommendationCounts, 
                             Map<String, Long> qualificationCounts, List<MonthlySubmissions> monthlySubmissions) {
        this.totalSubmissions = totalSubmissions;
        this.recommendationCounts = recommendationCounts;
        this.qualificationCounts = qualificationCounts;
        this.monthlySubmissions = monthlySubmissions;
    }

    // Getters and Setters
    public long getTotalSubmissions() {
        return totalSubmissions;
    }

    public void setTotalSubmissions(long totalSubmissions) {
        this.totalSubmissions = totalSubmissions;
    }

    public Map<String, Long> getRecommendationCounts() {
        return recommendationCounts;
    }

    public void setRecommendationCounts(Map<String, Long> recommendationCounts) {
        this.recommendationCounts = recommendationCounts;
    }

    public Map<String, Long> getQualificationCounts() {
        return qualificationCounts;
    }

    public void setQualificationCounts(Map<String, Long> qualificationCounts) {
        this.qualificationCounts = qualificationCounts;
    }

    public List<MonthlySubmissions> getMonthlySubmissions() {
        return monthlySubmissions;
    }

    public void setMonthlySubmissions(List<MonthlySubmissions> monthlySubmissions) {
        this.monthlySubmissions = monthlySubmissions;
    }

    // Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalSubmissions;
        private Map<String, Long> recommendationCounts;
        private Map<String, Long> qualificationCounts;
        private List<MonthlySubmissions> monthlySubmissions;

        public Builder totalSubmissions(long totalSubmissions) {
            this.totalSubmissions = totalSubmissions;
            return this;
        }

        public Builder recommendationCounts(Map<String, Long> recommendationCounts) {
            this.recommendationCounts = recommendationCounts;
            return this;
        }

        public Builder qualificationCounts(Map<String, Long> qualificationCounts) {
            this.qualificationCounts = qualificationCounts;
            return this;
        }

        public Builder monthlySubmissions(List<MonthlySubmissions> monthlySubmissions) {
            this.monthlySubmissions = monthlySubmissions;
            return this;
        }

        public AnalyticsResponse build() {
            return new AnalyticsResponse(totalSubmissions, recommendationCounts, qualificationCounts, monthlySubmissions);
        }
    }

    public static class MonthlySubmissions {
        private String month;
        private long count;

        // Default constructor
        public MonthlySubmissions() {}

        // All-args constructor
        public MonthlySubmissions(String month, long count) {
            this.month = month;
            this.count = count;
        }

        // Getters and Setters
        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }
}
