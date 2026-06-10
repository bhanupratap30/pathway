package com.academic.pathway.dto;

import jakarta.validation.constraints.*;

public class SubmissionRequest {
    @NotBlank(message = "Full name is required")
    @Size(min = 3, message = "Full name must be at least 3 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    private String email;

    @NotBlank(message = "Highest qualification is required")
    @Pattern(regexp = "^(High School|Diploma|Bachelor's Degree|Master's Degree|MBA|PhD|Other)$", 
             message = "Invalid qualification selected")
    private String qualification;

    @NotNull(message = "Years of experience is required")
    @Min(value = 0, message = "Years of experience cannot be negative")
    @Max(value = 50, message = "Years of experience cannot exceed 50")
    private Double experience;

    @NotBlank(message = "Current profession is required")
    private String profession;

    @NotBlank(message = "Career goal is required")
    @Size(min = 10, message = "Career goal must be at least 10 characters")
    private String careerGoal;

    // Default constructor
    public SubmissionRequest() {}

    // All-args constructor
    public SubmissionRequest(String fullName, String email, String qualification, Double experience, 
                             String profession, String careerGoal) {
        this.fullName = fullName;
        this.email = email;
        this.qualification = qualification;
        this.experience = experience;
        this.profession = profession;
        this.careerGoal = careerGoal;
    }

    // Getters and Setters
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

    public Double getExperience() {
        return experience;
    }

    public void setExperience(Double experience) {
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

    // Builder pattern
    public static SubmissionRequestBuilder builder() {
        return new SubmissionRequestBuilder();
    }

    public static class SubmissionRequestBuilder {
        private String fullName;
        private String email;
        private String qualification;
        private Double experience;
        private String profession;
        private String careerGoal;

        public SubmissionRequestBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public SubmissionRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public SubmissionRequestBuilder qualification(String qualification) {
            this.qualification = qualification;
            return this;
        }

        public SubmissionRequestBuilder experience(Double experience) {
            this.experience = experience;
            return this;
        }

        public SubmissionRequestBuilder profession(String profession) {
            this.profession = profession;
            return this;
        }

        public SubmissionRequestBuilder careerGoal(String careerGoal) {
            this.careerGoal = careerGoal;
            return this;
        }

        public SubmissionRequest build() {
            return new SubmissionRequest(fullName, email, qualification, experience, profession, careerGoal);
        }
    }
}
