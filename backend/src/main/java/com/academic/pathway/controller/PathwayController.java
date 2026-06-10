package com.academic.pathway.controller;

import com.academic.pathway.dto.AnalyticsResponse;
import com.academic.pathway.dto.SubmissionRequest;
import com.academic.pathway.dto.SubmissionResponse;
import com.academic.pathway.service.RecommendationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class PathwayController {

    private static final Logger log = LoggerFactory.getLogger(PathwayController.class);

    private final RecommendationService recommendationService;

    // Standard constructor injection
    public PathwayController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    /**
     * POST /api/v1/recommendations
     * Generates a recommended academic pathway and saves the submission.
     */
    @PostMapping("/recommendations")
    public ResponseEntity<SubmissionResponse> createRecommendation(@Valid @RequestBody SubmissionRequest request) {
        log.info("Received request to generate recommendation for: {}", request.getFullName());
        SubmissionResponse response = recommendationService.processSubmission(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/v1/submissions
     * Retrieves a paginated and search-filtered list of all student submissions.
     */
    @GetMapping("/submissions")
    public ResponseEntity<Page<SubmissionResponse>> getSubmissions(
            @RequestParam(value = "search", required = false) String searchTerm,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "direction", defaultValue = "desc") String direction) {
        
        log.info("Received request to fetch submissions list");
        Sort sort = direction.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<SubmissionResponse> submissions = recommendationService.getSubmissions(searchTerm, pageable);
        
        return ResponseEntity.ok(submissions);
    }

    /**
     * GET /api/v1/analytics
     * Retrieves aggregated statistics and counts for dashboard visualization.
     */
    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        log.info("Received request to retrieve dashboard metrics");
        AnalyticsResponse analytics = recommendationService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }
}
