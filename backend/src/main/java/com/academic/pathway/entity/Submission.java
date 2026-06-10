package com.academic.pathway.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "submissions")
public class Submission {
    @Id
    private String id;
    private String fullName;
    private String email;
    private String qualification;
    private double experience;
    private String profession;
    private String careerGoal;
    private String recommendation;
    private String reason;
    private List<String> nextSteps;
    private LocalDateTime createdAt;

    // Default constructor
    public Submission() {}

    // All-args constructor
    public Submission(String id, String fullName, String email, String qualification, double experience, 
                      String profession, String careerGoal, String recommendation, String reason, 
                      List<String> nextSteps, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.qualification = qualification;
        this.experience = experience;
        this.profession = profession;
        this.careerGoal = careerGoal;
        this.recommendation = recommendation;
        this.reason = reason;
        this.nextSteps = nextSteps;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public double getExperience() {
        return experience;
    }

    public void setExperience(double experience) {
        this.experience = experience;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public String getCareerGoal() {
        return careerGoal;
    }

    public void setCareerGoal(String careerGoal) {
        this.careerGoal = careerGoal;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public List<String> getNextSteps() {
        return nextSteps;
    }

    public void setNextSteps(List<String> nextSteps) {
        this.nextSteps = nextSteps;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Builder static class to maintain the builder pattern used in service
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String fullName;
        private String email;
        private String qualification;
        private double experience;
        private String profession;
        private String careerGoal;
        private String recommendation;
        private String reason;
        private List<String> nextSteps;
        private LocalDateTime createdAt;

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder qualification(String qualification) {
            this.qualification = qualification;
            return this;
        }

        public Builder experience(double experience) {
            this.experience = experience;
            return this;
        }

        public Builder profession(String profession) {
            this.profession = profession;
            return this;
        }

        public Builder careerGoal(String careerGoal) {
            this.careerGoal = careerGoal;
            return this;
        }

        public Builder recommendation(String recommendation) {
            this.recommendation = recommendation;
            return this;
        }

        public Builder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public Builder nextSteps(List<String> nextSteps) {
            this.nextSteps = nextSteps;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Submission build() {
            return new Submission(id, fullName, email, qualification, experience, profession, careerGoal, recommendation, reason, nextSteps, createdAt);
        }
    }
}
