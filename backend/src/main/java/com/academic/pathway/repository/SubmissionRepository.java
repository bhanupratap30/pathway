package com.academic.pathway.repository;

import com.academic.pathway.entity.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends MongoRepository<Submission, String> {
    
    // Fetch recent submissions first
    List<Submission> findAllByOrderByCreatedAtDesc();

    // Custom query for multi-field search and filtering
    @Query("{ '$or': [ " +
           "  { 'fullName': { '$regex': ?0, '$options': 'i' } }, " +
           "  { 'email': { '$regex': ?0, '$options': 'i' } }, " +
           "  { 'recommendation': { '$regex': ?0, '$options': 'i' } } " +
           "] }")
    Page<Submission> searchSubmissions(String searchTerm, Pageable pageable);

    // Grouping count queries for analytics (could also be done via MongoDB aggregation, but these are fast and simple)
    long countByRecommendation(String recommendation);
    long countByQualification(String qualification);
}
