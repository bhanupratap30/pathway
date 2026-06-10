package com.academic.pathway;

import com.academic.pathway.dto.SubmissionRequest;
import com.academic.pathway.service.RecommendationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.academic.pathway.repository.SubmissionRepository;
import com.academic.pathway.service.EmailService;
import com.academic.pathway.mapper.SubmissionMapper;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class RecommendationServiceTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private SubmissionMapper submissionMapper;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private RecommendationService recommendationService;

    private SubmissionRequest.SubmissionRequestBuilder requestBuilder;

    @BeforeEach
    void setUp() {
        requestBuilder = SubmissionRequest.builder()
                .fullName("Test User")
                .email("test@example.com")
                .profession("Software Engineer")
                .careerGoal("Build high performance systems");
    }

    @Test
    void testClassifyPathway_HonoraryDoctorate() {
        // Experience >= 15 AND profession is CEO/Director/Founder/Executive
        SubmissionRequest request = requestBuilder
                .qualification("Master's Degree")
                .experience(16.0)
                .profession("CEO & Founder")
                .careerGoal("To make a global industry contribution and leave a legacy.")
                .build();

        String result = recommendationService.classifyPathway(request);
        assertEquals("Honorary Doctorate", result);
    }

    @Test
    void testClassifyPathway_PhD() {
        // Master's degree AND experience >= 5 AND research goals
        SubmissionRequest request = requestBuilder
                .qualification("Master's Degree")
                .experience(6.0)
                .profession("Senior Researcher")
                .careerGoal("Conduct scientific research and teach as a university professor.")
                .build();

        String result = recommendationService.classifyPathway(request);
        assertEquals("PhD", result);
    }

    @Test
    void testClassifyPathway_DBA() {
        // Master's degree AND experience between 3-10 AND management goals
        SubmissionRequest request = requestBuilder
                .qualification("Master's Degree")
                .experience(5.0)
                .profession("Product Manager")
                .careerGoal("Transition to business administration and executive corporate management.")
                .build();

        String result = recommendationService.classifyPathway(request);
        assertEquals("DBA", result);
    }

    @Test
    void testClassifyPathway_CertificationProgram_Experience() {
        // Experience < 3
        SubmissionRequest request = requestBuilder
                .qualification("Bachelor's Degree")
                .experience(2.0)
                .profession("Junior Engineer")
                .careerGoal("Get a specialized software certification.")
                .build();

        String result = recommendationService.classifyPathway(request);
        assertEquals("Certification Program", result);
    }

    @Test
    void testClassifyPathway_CertificationProgram_Switch() {
        // Career switch keywords
        SubmissionRequest request = requestBuilder
                .qualification("Bachelor's Degree")
                .experience(5.0)
                .profession("Accountant")
                .careerGoal("I want to switch careers and transition to artificial intelligence.")
                .build();

        String result = recommendationService.classifyPathway(request);
        assertEquals("Certification Program", result);
    }

    @Test
    void testClassifyPathway_Fallback_ToCertification() {
        // Bachelor's degree and normal advancement goal (no management/research keywords)
        SubmissionRequest request = requestBuilder
                .qualification("Bachelor's Degree")
                .experience(4.0)
                .profession("Developer")
                .careerGoal("Gain deeper engineering skills and technical knowledge.")
                .build();

        String result = recommendationService.classifyPathway(request);
        assertEquals("Certification Program", result);
    }
}