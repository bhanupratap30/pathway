package com.academic.pathway.service;

import com.academic.pathway.dto.AnalyticsResponse;
import com.academic.pathway.dto.SubmissionRequest;
import com.academic.pathway.dto.SubmissionResponse;
import com.academic.pathway.entity.Submission;
import com.academic.pathway.mapper.SubmissionMapper;
import com.academic.pathway.repository.SubmissionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);

    private final SubmissionRepository submissionRepository;
    private final EmailService emailService;
    private final SubmissionMapper submissionMapper;
    private final ObjectMapper objectMapper;
    
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Value("${grok.api.key:}")
    private String grokApiKey;

    @Value("${grok.model:grok-2}")
    private String grokModel;

    private static final String GROK_API_URL = "https://api.x.ai/v1/chat/completions";

    // Standard constructor injection
    public RecommendationService(SubmissionRepository submissionRepository, EmailService emailService, 
                                 SubmissionMapper submissionMapper, ObjectMapper objectMapper) {
        this.submissionRepository = submissionRepository;
        this.emailService = emailService;
        this.submissionMapper = submissionMapper;
        this.objectMapper = objectMapper;
    }

    /**
     * Core submission process:
     * 1. Classifies pathway & generates reasoning.
     * 2. Saves profile submission in MongoDB.
     * 3. Sends recommendation email in the background.
     * 4. Returns the response.
     */
    public SubmissionResponse processSubmission(SubmissionRequest request) {
        log.info("Processing submission for: {}", request.getFullName());
        
        // 1. Generate pathway, reason, and next steps
        String pathway = classifyPathway(request);
        String reason = generateReason(request, pathway);
        List<String> nextSteps = generateNextSteps(pathway);

        // 2. Map request to Entity and save
        Submission submission = submissionMapper.requestToEntity(request);
        submission.setRecommendation(pathway);
        submission.setReason(reason);
        submission.setNextSteps(nextSteps);
        submission.setCreatedAt(LocalDateTime.now());
        
        Submission savedSubmission = submissionRepository.save(submission);
        log.info("Saved submission to MongoDB with ID: {}", savedSubmission.getId());

        // 3. Send email asynchronously using CompletableFuture to keep response times low
        CompletableFuture.runAsync(() -> {
            try {
                emailService.sendRecommendationEmail(
                        savedSubmission.getEmail(),
                        savedSubmission.getFullName(),
                        savedSubmission.getRecommendation(),
                        savedSubmission.getReason()
                );
            } catch (Exception e) {
                log.error("Async email dispatch failed for: {}", savedSubmission.getEmail(), e);
            }
        });

        // 4. Return mapped DTO response
        return submissionMapper.entityToResponse(savedSubmission);
    }

    /**
     * Get paginated and filtered submissions.
     */
    public Page<SubmissionResponse> getSubmissions(String searchTerm, Pageable pageable) {
        log.info("Fetching submissions page. SearchTerm: '{}', Page: {}, Size: {}", 
                searchTerm, pageable.getPageNumber(), pageable.getPageSize());

        Page<Submission> submissionPage;
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            submissionPage = submissionRepository.searchSubmissions(searchTerm.trim(), pageable);
        } else {
            submissionPage = submissionRepository.findAll(pageable);
        }

        return submissionPage.map(submissionMapper::entityToResponse);
    }

    /**
     * Compute analytics metrics for the dashboard.
     */
    public AnalyticsResponse getAnalytics() {
        log.info("Computing dashboard analytics metrics...");
        List<Submission> allSubmissions = submissionRepository.findAllByOrderByCreatedAtDesc();

        long total = allSubmissions.size();

        // 1. Calculate Recommendation Counts
        Map<String, Long> recCounts = allSubmissions.stream()
                .collect(Collectors.groupingBy(Submission::getRecommendation, Collectors.counting()));

        // Ensure key recommendation options are initialized in the map (to avoid empty charts)
        List.of("Certification Program", "DBA", "PhD", "Honorary Doctorate")
                .forEach(rec -> recCounts.putIfAbsent(rec, 0L));

        // 2. Calculate Qualification Counts
        Map<String, Long> qualCounts = allSubmissions.stream()
                .collect(Collectors.groupingBy(Submission::getQualification, Collectors.counting()));

        List.of("High School", "Diploma", "Bachelor's Degree", "Master's Degree", "MBA", "PhD", "Other")
                .forEach(qual -> qualCounts.putIfAbsent(qual, 0L));

        // 3. Calculate Monthly Submissions
        // We group submissions by month-year format "MMM yyyy" (e.g. "Jun 2026")
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH);
        
        Map<String, Long> rawMonthlyMap = allSubmissions.stream()
                .filter(s -> s.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        s -> s.getCreatedAt().format(formatter),
                        Collectors.counting()
                ));

        List<AnalyticsResponse.MonthlySubmissions> monthlyDataList = rawMonthlyMap.entrySet().stream()
                .map(entry -> new AnalyticsResponse.MonthlySubmissions(entry.getKey(), entry.getValue()))
                .sorted((m1, m2) -> {
                    try {
                        DateTimeFormatter parser = DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH);
                        LocalDateTime date1 = LocalDateTime.parse("01 " + m1.getMonth(), DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH));
                        LocalDateTime date2 = LocalDateTime.parse("01 " + m2.getMonth(), DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH));
                        return date1.compareTo(date2);
                    } catch (Exception e) {
                        return m1.getMonth().compareTo(m2.getMonth()); // String fallback comparison
                    }
                })
                .collect(Collectors.toList());

        if (monthlyDataList.isEmpty()) {
            String currentMonth = LocalDateTime.now().format(formatter);
            monthlyDataList.add(new AnalyticsResponse.MonthlySubmissions(currentMonth, 0L));
        }

        return AnalyticsResponse.builder()
                .totalSubmissions(total)
                .recommendationCounts(recCounts)
                .qualificationCounts(qualCounts)
                .monthlySubmissions(monthlyDataList)
                .build();
    }

    /**
     * Classifies the academic pathway based on the project requirements.
     */
    public String classifyPathway(SubmissionRequest request) {
        String qualification = request.getQualification();
        double experience = request.getExperience();
        String profession = request.getProfession().toLowerCase();
        String careerGoal = request.getCareerGoal().toLowerCase();

        // Helper flags for keywords
        boolean isHighExp = experience >= 10;
        boolean isMidExp = experience >= 3;
        
        boolean hasAcademicOrResearchGoal = careerGoal.contains("research") 
                || careerGoal.contains("academia")
                || careerGoal.contains("professor") 
                || careerGoal.contains("scientist")
                || careerGoal.contains("academic") 
                || careerGoal.contains("study")
                || careerGoal.contains("scientific") 
                || careerGoal.contains("teaching")
                || careerGoal.contains("phd");
                
        boolean hasManagementOrLeadershipGoal = careerGoal.contains("management") 
                || careerGoal.contains("manager")
                || careerGoal.contains("lead") 
                || careerGoal.contains("executive")
                || careerGoal.contains("business") 
                || careerGoal.contains("administration")
                || careerGoal.contains("strategy") 
                || careerGoal.contains("director")
                || careerGoal.contains("corporate")
                || careerGoal.contains("leadership")
                || careerGoal.contains("ceo")
                || careerGoal.contains("founder");

        boolean isExecutiveProfession = profession.contains("ceo") 
                || profession.contains("director") 
                || profession.contains("president") 
                || profession.contains("vp") 
                || profession.contains("founder") 
                || profession.contains("chief")
                || profession.contains("head") 
                || profession.contains("partner")
                || profession.contains("executive") 
                || profession.contains("principal")
                || profession.contains("manager");

        // Rule 1: Honorary Doctorate (Senior leaders with executive role or industry legacy goals)
        if (experience >= 10 && (isExecutiveProfession || hasManagementOrLeadershipGoal)) {
            return "Honorary Doctorate";
        }

        // Rule 2: PhD (Academic, teaching, or research target goal for degree holders)
        boolean hasDegree = qualification.equalsIgnoreCase("Master's Degree") 
                || qualification.equalsIgnoreCase("MBA") 
                || qualification.equalsIgnoreCase("PhD")
                || qualification.equalsIgnoreCase("Bachelor's Degree");

        if (hasDegree && experience >= 3 && hasAcademicOrResearchGoal) {
            return "PhD";
        }

        // Rule 3: DBA (Management, strategy, corporate operations for degree holders)
        if (hasDegree && experience >= 3 && (hasManagementOrLeadershipGoal || isExecutiveProfession)) {
            return "DBA";
        }

        // Check for career switch or student status before running the fallback rules
        boolean isStudent = profession.contains("student");
        boolean isCareerSwitch = careerGoal.contains("switch") || careerGoal.contains("change")
                || careerGoal.contains("transition") || careerGoal.contains("pivot")
                || careerGoal.contains("new career") || careerGoal.contains("new field");

        if (isStudent || experience < 3 || isCareerSwitch) {
            return "Certification Program";
        }

        // Fallbacks for intermediate cases
        if (experience >= 10) {
            return "Honorary Doctorate";
        } else if (experience >= 5) {
            if (hasAcademicOrResearchGoal) {
                return "PhD";
            }
            return "DBA";
        }

        // Rule 4: Certification Program (Default for entry-level, students, career transitions, and low experience)
        return "Certification Program";
    }

    /**
     * Generates actionable next steps milestones based on the selected pathway.
     */
    public List<String> generateNextSteps(String pathway) {
        switch (pathway) {
            case "Honorary Doctorate":
                return List.of(
                    "Compile a comprehensive portfolio of your executive contributions, patents, or publications.",
                    "Identify 3 accredited institutions that offer honorary academic designations in your industry.",
                    "Request nomination backing letters from 2-3 prominent corporate trustees or advisory members.",
                    "Submit your formal case files to the institutional honorary committee panel."
                );
            case "PhD":
                return List.of(
                    "Draft a preliminary research proposal (1,000–1,500 words) defining your research gaps.",
                    "Identify and contact 2 potential advisors/research supervisors working in your targeted domain.",
                    "Check university GRE/TOEFL requirements and request official transcripts from previous institutions.",
                    "Align application deadlines (typically Dec/Jan) and prepare academic letters of recommendation."
                );
            case "DBA":
                return List.of(
                    "Revise your executive CV to heavily emphasize operational leadership tenure and strategy.",
                    "Select a concrete, current corporate business issue to serve as your dissertation topic.",
                    "Secure 2 professional recommendations from senior managers, directors, or executive peers.",
                    "Apply for executive GMAT waivers and investigate company-sponsored corporate funding options."
                );
            case "Certification Program":
                return List.of(
                    "Compare skill gaps from your current role against target job postings (e.g. cloud, management).",
                    "Choose an accredited provider (e.g., major university certificates, AWS, PMI, Google).",
                    "Enroll in the core module and schedule a consistent 5-10 hours per week study commitment.",
                    "Complete hands-on portfolio projects and update your LinkedIn profile to showcase the credential."
                );
            case "MBA":
                return List.of(
                    "Analyze executive MBA program cohort schedules (hybrid, online, weekend formats).",
                    "Prepare your admission essays highlighting team leadership and decision-making impact.",
                    "Request professional references from senior organizational managers or business clients.",
                    "Verify admission interview formats and prepare a case study analysis response."
                );
            case "Master's Degree":
                return List.of(
                    "Research specialized graduate schools matching your exact target field and curriculum structure.",
                    "Write a focused Statement of Purpose explaining how this Master's degree enables your goals.",
                    "Collect certified academic transcripts and request letters of recommendation from former professors.",
                    "Explore assistantships, graduate funding pools, or departmental research fellowships."
                );
            default: // Bachelor's Degree
                return List.of(
                    "Identify target majors and select universities offering strong programs in your region.",
                    "Gather official transcripts from high school or diploma programs and submit credential evaluations.",
                    "Draft personal statement essays explaining your professional career roadmap and drive.",
                    "Submit FAFSA/scholarship files and complete university enrollment application forms."
                );
        }
    }

    /**
     * Generates recommendation reasoning. Calls Grok if API key is provided, otherwise falls back to local rules.
     */
    private String generateReason(SubmissionRequest request, String pathway) {
        if (grokApiKey != null && !grokApiKey.trim().isEmpty()) {
            try {
                log.info("Calling Grok API ({}) for recommendation reasoning...", grokModel);
                return callGrokApi(request, pathway);
            } catch (Exception e) {
                log.error("Failed to generate reasoning using Grok API. Falling back to local heuristics.", e);
            }
        } else {
            log.info("Grok API key is not configured. Using local template-based reasoning.");
        }
        return generateLocalReason(request, pathway);
    }

    /**
     * Calls Grok API (xAI) using native HttpClient.
     */
    private String callGrokApi(SubmissionRequest request, String pathway) throws Exception {
        String systemPrompt = "You are an elite academic pathway advisor. Write a highly professional, structured, and encouraging recommendation reasoning (around 150-220 words). " +
                "First, explain why the recommended academic pathway is the perfect match for the user's qualifications and goals. " +
                "Second, provide a structured section listing specific, high-quality college courses, degree programs, or professional certifications from India, the UK, and the USA that directly align with this pathway. " +
                "Structure this section exactly as follows:\n\n" +
                "Recommended Institutions & Programs:\n" +
                "• India: [List specific colleges, courses, or certifications]\n" +
                "• UK: [List specific colleges, courses, or certifications]\n" +
                "• USA: [List specific colleges, courses, or certifications]\n\n" +
                "Keep the tone academic, structured, and practical. Do not include introductory or concluding conversational filler.";
        
        String userPrompt = String.format(
                "User Profile:\n" +
                "- Name: %s\n" +
                "- Qualification: %s\n" +
                "- Experience: %.1f years\n" +
                "- Current Profession: %s\n" +
                "- Career Goal: %s\n" +
                "- Recommended Pathway: %s\n\n" +
                "Provide the custom reasoning.",
                request.getFullName(), request.getQualification(), request.getExperience(), 
                request.getProfession(), request.getCareerGoal(), pathway
        );

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", grokModel);
        payload.put("temperature", 0.7);
        payload.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
        ));

        String requestBody = objectMapper.writeValueAsString(payload);

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(GROK_API_URL))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + grokApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .timeout(Duration.ofSeconds(10))
                .build();

        HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (httpResponse.statusCode() != 200) {
            throw new RuntimeException("xAI API returned status code " + httpResponse.statusCode() + ": " + httpResponse.body());
        }

        JsonNode responseJson = objectMapper.readTree(httpResponse.body());
        String reasoning = responseJson.path("choices").path(0).path("message").path("content").asText();
        
        if (reasoning == null || reasoning.trim().isEmpty()) {
            throw new RuntimeException("Received empty response content from xAI API");
        }

        return reasoning.trim();
    }

    /**
     * Fallback method to generate standard high-quality academic reasoning text templates.
     */
    private String generateLocalReason(SubmissionRequest request, String pathway) {
        String name = request.getFullName();
        double exp = request.getExperience();
        String qualification = request.getQualification();
        String profession = request.getProfession();
        String goal = request.getCareerGoal();

        switch (pathway) {
            case "Honorary Doctorate":
                return String.format("Dear %s, based on your exemplary academic credentials of %s and a distinguished professional background of %.1f years, culminating in your role as a %s, you have demonstrated exceptional leadership and significant industry impact. An Honorary Doctorate recognizes your prominent contributions and leadership stature within the industry. It stands as an official testament to your expertise, validation, and professional influence, aligning perfectly with your goal of '%s' without requiring standard research coursework." +
                        "\n\nRecommended Institutions & Programs:\n" +
                        "• India: IIT Kharagpur (Hon. D.Sc.), Amity University (Hon. Doctorate), IISc Bangalore (Honorary Fellowship)\n" +
                        "• UK: University of Oxford (Hon. D.Mus./D.Litt.), University of Cambridge (Honorary Degree)\n" +
                        "• USA: Harvard University (Hon. LL.D./D.Sc.), Yale University (Honorary Doctorates)\n",
                        name, qualification, exp, profession, goal);

            case "PhD":
                return String.format("Dear %s, your combination of a %s, %.1f years of professional experience, and research-focused aspirations ('%s') aligns exceptionally well with a Doctor of Philosophy (PhD). A PhD is research-intensive, designed to cultivate advanced scholars. It will provide you with the methodological training required to conduct original investigations, publish scholarly articles, and prepare for academic or high-level scientific roles. This pathway will allow you to leverage your background as a %s to contribute new theoretical and empirical findings to your discipline." +
                        "\n\nRecommended Institutions & Programs:\n" +
                        "• India: IISc Bangalore (Ph.D. Research), IIT Bombay (Doctoral Fellowships), IIT Delhi (Research Ph.D.)\n" +
                        "• UK: University of Cambridge (Doctor of Philosophy), Imperial College London (Ph.D. Schemes), University of Edinburgh (Doctoral College)\n" +
                        "• USA: Stanford University (Ph.D. Programs), MIT (Doctoral Degrees), UC Berkeley (Graduate Ph.D.)\n",
                        name, qualification, exp, goal, profession);

            case "DBA":
                return String.format("Dear %s, with your %s and %.1f years of operational experience as a %s, your ambition to excel in executive leadership ('%s') makes you an ideal candidate for a Doctor of Business Administration (DBA). Unlike a PhD, which focuses on preparing candidates for academic career tracks, a DBA is a professional doctorate designed to apply academic research and management theories directly to complex business issues. This program will empower you with critical decision-making frameworks to drive organizational strategy and innovation." +
                        "\n\nRecommended Institutions & Programs:\n" +
                        "• India: ISB Hyderabad (Executive Fellow Program in Management), SPJIMR Mumbai (Doctoral Program), IIM Ahmedabad (Ph.D. for Executives)\n" +
                        "• UK: Warwick Business School (Doctor of Business Administration), Cranfield School of Management (DBA), Manchester Business School (Executive DBA)\n" +
                        "• USA: Harvard Business School (Doctorate Programs), Wharton School UPenn (Executive Executive Ph.D.), Chicago Booth (DBA Pathways)\n",
                        name, qualification, exp, profession, goal);

            case "Certification Program":
                return String.format("Dear %s, considering your current standing as a %s and your %.1f years of professional experience, a specialized Certification Program is the most strategic next step. It offers an agile, practice-oriented curriculum designed to address specific skill gaps and provide credentials rapidly. This is highly suitable for supporting a career pivot or establishing foundational knowledge, directly serving your goal of '%s' by offering target-oriented training and industry-recognized qualifications." +
                        "\n\nRecommended Institutions & Programs:\n" +
                        "• India: IIT Madras Online (Advanced Certifications), ISB Executive Education (Management Certificates), UpGrad/Simplilearn Post-Graduate Programs\n" +
                        "• UK: Oxford Saïd Business School (Executive Leadership Certificates), London Business School (Executive Certifications)\n" +
                        "• USA: Harvard Extension School (Professional Graduate Certificates), Stanford Center for Professional Development (SCPD), Coursera/edX Professional Specializations (PMI PMP, Google Cloud, AWS Solutions Architect)\n",
                        name, profession, exp, goal);

            case "MBA":
                return String.format("Dear %s, with a %s and %.1f years of experience as a %s, pursuing a Master of Business Administration (MBA) is highly recommended. This program will equip you with comprehensive business literacy, leadership competencies, and an extensive professional network. It is the perfect bridge to help you transition into managerial roles and fulfill your ambition to '%s'.",
                        name, qualification, exp, profession, goal);

            case "Master's Degree":
                return String.format("Dear %s, your profile indicating a %s and %.1f years of experience suggests that a specialized Master's Degree is your optimal academic path. This degree will deepen your domain expertise, keep you abreast of industry developments, and provide advanced credentials. It will support your goals of '%s' by refining your capabilities and expanding your academic foundation beyond a undergraduate level.",
                        name, qualification, exp, goal);

            default: // Bachelor's Degree
                return String.format("Dear %s, as a %s with a highest qualification of %s, pursuing a Bachelor's Degree is the recommended pathway to establish a robust academic and professional baseline. This degree will offer core theoretical frameworks, research capabilities, and hands-on projects, giving you the necessary credentials and capabilities to achieve your goal of '%s' and unlock subsequent career opportunities.",
                        name, profession, qualification, goal);
        }
    }
}
