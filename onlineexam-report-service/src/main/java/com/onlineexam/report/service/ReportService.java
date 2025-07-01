package com.onlineexam.report.service;

import com.onlineexam.report.dto.ReportSummaryDTO;
import com.onlineexam.report.dto.ResponseSummaryDTO;
import com.onlineexam.report.dto.ExamResponseDTO; // Import ExamResponseDTO
import com.onlineexam.report.dto.UserDTO; // Import UserDTO
import com.onlineexam.report.entity.Report;
import com.onlineexam.report.feignclient.ResponseFeignClient;
import com.onlineexam.report.feignclient.ExamFeignClient; // Import ExamFeignClient
import com.onlineexam.report.feignclient.UserFeignClient; // Import UserFeignClient
import com.onlineexam.report.repository.ReportRepository;
import com.onlineexam.report.repository.UserMaxMarksProjection; // Import the new projection interface
import com.onlineexam.report.exception.ResourceNotFoundException; // Import for consistency

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ResponseFeignClient responseFeignClient; // Autowire the Feign client

    @Autowired
    private ExamFeignClient examFeignClient; // Autowire the new Exam Feign client

    @Autowired
    private UserFeignClient userFeignClient; // Autowire the new User Feign client

    /**
     * Generates a report for a specific user and exam by fetching responses from the Response Microservice,
     * calculating marks obtained, determining performance metrics, and saving the report.
     *
     * @param userId The ID of the user.
     * @param examId The ID of the exam.
     * @return The newly generated ReportSummaryDTO.
     * @throws RuntimeException          if there's an error communicating with the Response Service, Exam Service, or User Service.
     * @throws ResourceNotFoundException if responses, exam, or user cannot be retrieved.
     * @throws IllegalArgumentException  if no responses are found for the given user and exam.
     */
    public ReportSummaryDTO generateReport(Integer userId, Integer examId) {
        // Fetch responses
        ResponseEntity<List<ResponseSummaryDTO>> responseEntity = null;
        try {
            responseEntity = responseFeignClient.getResponsesByUserAndExam(userId, examId);
        } catch (Exception e) {
            throw new RuntimeException("Error communicating with Response Service: " + e.getMessage(), e);
        }

        if (!responseEntity.getStatusCode().is2xxSuccessful() || responseEntity.getBody() == null) {
            throw new ResourceNotFoundException("Failed to retrieve responses from Response Service for user " + userId + " and exam " + examId + ". Status: " + responseEntity.getStatusCode());
        }

        List<ResponseSummaryDTO> responses = responseEntity.getBody();

        if (responses.isEmpty()) {
            throw new IllegalArgumentException("No responses found for user " + userId + " and exam " + examId + " from Response Service.");
        }

        int marksObtained = responses.stream() // Changed from totalMarks to marksObtained
                .mapToInt(ResponseSummaryDTO::getMarksObtained)
                .sum();

        // Fetch exam details to get maxMarks and examTitle
        ResponseEntity<ExamResponseDTO> examResponseEntity = null;
        try {
            examResponseEntity = examFeignClient.getExamById(examId);
        } catch (Exception e) {
            throw new RuntimeException("Error communicating with Exam Management Service: " + e.getMessage(), e);
        }

        if (!examResponseEntity.getStatusCode().is2xxSuccessful() || examResponseEntity.getBody() == null) {
            throw new ResourceNotFoundException("Failed to retrieve exam details for exam " + examId + ". Status: " + examResponseEntity.getStatusCode());
        }
        ExamResponseDTO examDetails = examResponseEntity.getBody();
        Integer maxMarks = examDetails.getTotalMarks();
        String examTitle = examDetails.getTitle(); // Get examTitle

        if (maxMarks == null) {
            throw new IllegalStateException("Max marks not found for exam: " + examId);
        }
        if (examTitle == null) {
            throw new IllegalStateException("Exam title not found for exam: " + examId);
        }

        // Fetch user details to get username
        ResponseEntity<UserDTO> userResponseEntity = null;
        try {
            userResponseEntity = userFeignClient.getUserById(userId);
        } catch (Exception e) {
            throw new RuntimeException("Error communicating with User Service: " + e.getMessage(), e);
        }

        if (!userResponseEntity.getStatusCode().is2xxSuccessful() || userResponseEntity.getBody() == null) {
            throw new ResourceNotFoundException("Failed to retrieve user details for user " + userId + ". Status: " + userResponseEntity.getStatusCode());
        }
        String username = userResponseEntity.getBody().getName();
        if (username == null) {
            throw new IllegalStateException("Username not found for user: " + userId);
        }


        // Calculate performance metrics based on new logic
        String performance;
        if (marksObtained >= maxMarks * 0.6) { // Changed to marksObtained
            performance = "First Class";
        } else if (marksObtained >= maxMarks * 0.4) { // Changed to marksObtained
            performance = "Second Class";
        } else {
            performance = "Fail";
        }

        Report report = new Report();
        report.setUserId(userId);
        report.setExamId(examId);
        report.setExamTitle(examTitle); // Set examTitle
        report.setUsername(username); // Set username
        report.setMaxMarks(maxMarks); // Set maxMarks
        report.setMarksObtained(marksObtained); // Changed from totalMarks to marksObtained
        report.setPerformanceMetrics(performance);

        Report savedReport = reportRepository.save(report);
        return mapToDto(savedReport); // Return DTO
    }

    /**
     * Retrieves a list of reports for a specific exam ID.
     *
     * @param examId The ID of the exam.
     * @return A list of ReportSummaryDTOs.
     * @throws ResourceNotFoundException if no reports are found for the given exam ID.
     */
    public List<ReportSummaryDTO> getReportsByExamId(Integer examId) {
        List<Report> reports = reportRepository.findByExamId(examId);
        if (reports.isEmpty()) {
            throw new ResourceNotFoundException("No reports found for exam ID: " + examId); // Use specific exception
        }
        return reports.stream()
                .map(this::mapToDto)
                .toList();
    }

    /**
     * Retrieves a list of reports for a specific user ID.
     *
     * @param userId The ID of the user.
     * @return A list of ReportSummaryDTOs.
     * @throws ResourceNotFoundException if no reports are found for the given user ID.
     */
    public List<ReportSummaryDTO> getReportsByUserId(Integer userId) {
        List<Report> reports = reportRepository.findByUserId(userId);
        if (reports.isEmpty()) {
            throw new ResourceNotFoundException("No reports found for user ID: " + userId); // Use specific exception
        }
        return reports.stream()
                .map(this::mapToDto)
                .toList();
    }

    /**
     * Retrieves a report for a specific user and exam ID.
     *
     * @param userId The ID of the user.
     * @param examId The ID of the exam.
     * @return An Optional containing the ReportSummaryDTO if found, otherwise empty.
     */
    public Optional<ReportSummaryDTO> getReportByUserIdAndExamId(Integer userId, Integer examId) {
        return reportRepository.findByUserIdAndExamId(userId, examId)
                .map(this::mapToDto);
    }

    /**
     * Retrieves all reports in the system.
     *
     * @return A list of all ReportSummaryDTOs.
     * @throws ResourceNotFoundException if no reports are found in the system.
     */
    public List<ReportSummaryDTO> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        if (reports.isEmpty()) {
            throw new ResourceNotFoundException("No reports found"); // Use specific exception
        }
        return reports.stream()
                .map(this::mapToDto)
                .toList();
    }

    /**
     * Helper method to map a Report entity to a ReportSummaryDTO.
     *
     * @param report The Report entity to map.
     * @return The corresponding ReportSummaryDTO.
     */
    private ReportSummaryDTO mapToDto(Report report) {
        return ReportSummaryDTO.builder()
                .reportId(report.getReportId())
                .examId(report.getExamId())
                .examTitle(Optional.ofNullable(report.getExamTitle()).orElse("N/A")) // Map examTitle
                .userId(report.getUserId())
                .username(Optional.ofNullable(report.getUsername()).orElse("N/A")) // Handle null username
                .maxMarks(Optional.ofNullable(report.getMaxMarks()).orElse(0)) // Handle null maxMarks, default to 0
                .marksObtained(report.getMarksObtained()) // Changed from totalMarks to marksObtained
                .performanceMetrics(report.getPerformanceMetrics())
                .build();
    }

    /**
     * Deletes reports based on provided userId and/or examId.
     * If both are provided, a specific report is deleted.
     * If only userId, all reports for that user are deleted.
     * If only examId, all reports for that exam are deleted.
     *
     * @param userId The ID of the user (optional).
     * @param examId The ID of the exam (optional).
     * @return true if reports were deleted, false otherwise.
     * @throws ResourceNotFoundException if no reports are found for the given criteria.
     * @throws IllegalArgumentException  if neither userId nor examId is provided.
     */
    public boolean deleteReports(Integer userId, Integer examId) {
        if (userId != null && examId != null) {
            Optional<Report> report = reportRepository.findByUserIdAndExamId(userId, examId);
            if (report.isPresent()) {
                reportRepository.delete(report.get());
                return true;
            } else {
                throw new ResourceNotFoundException("No report found for the given userId and examId."); // Use specific exception
            }
        } else if (userId != null) {
            List<Report> reports = reportRepository.findByUserId(userId);
            if (!reports.isEmpty()) {
                reportRepository.deleteAll(reports);
                return true;
            } else {
                throw new ResourceNotFoundException("No reports found for the given userId."); // Use specific exception
            }
        } else if (examId != null) {
            List<Report> reports = reportRepository.findByExamId(examId);
            if (!reports.isEmpty()) {
                reportRepository.deleteAll(reports);
                return true;
            } else {
                throw new ResourceNotFoundException("No reports found for the given examId."); // Use specific exception
            }
        } else {
            throw new IllegalArgumentException("At least one of userId or examId must be provided.");
        }
    }

    /**
     * Deletes all reports from the system.
     *
     * @throws ResourceNotFoundException if no reports are found to delete.
     */
    public void deleteAllReports() {
        List<Report> reports = reportRepository.findAll();
        if (reports.isEmpty()) {
            throw new ResourceNotFoundException("No reports found to delete."); // Use specific exception
        }
        reportRepository.deleteAll(reports);
    }

    /**
     * Returns the topper(s) based on the highest marks obtained. If multiple reports
     * have the same maximum marks obtained, it returns the DTO of the first one found.
     *
     * @return A ResponseEntity containing the ReportSummaryDTO of the topper, or a notFound status if no topper is found.
     */
    public ResponseEntity<ReportSummaryDTO> returnTopper() {
        List<Report> result = reportRepository.findTopperByMarksObtained(); // Changed method name

        if (!result.isEmpty()) {
            // If multiple toppers, just return the first one for the DTO
            Report report = result.get(0);
            ReportSummaryDTO dto = ReportSummaryDTO.builder()
                    .reportId(report.getReportId())
                    .examId(report.getExamId())
                    .examTitle(report.getExamTitle()) // Include examTitle
                    .userId(report.getUserId())
                    .username(report.getUsername()) // Include username
                    .maxMarks(report.getMaxMarks()) // Include maxMarks
                    .marksObtained(report.getMarksObtained()) // Changed from totalMarks to marksObtained
                    .performanceMetrics(report.getPerformanceMetrics())
                    .build();

            return ResponseEntity.ok(dto);
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * Retrieves the rank of a specific user based on their highest marks obtained across all their exams,
     * relative to the highest marks obtained of all other unique users.
     * Users with the same highest marks obtained will share the same rank.
     *
     * @param userId The ID of the user whose rank is to be determined.
     * @return The rank of the user.
     * @throws ResourceNotFoundException if no reports are found for the given userId.
     * @throws RuntimeException if no reports are found in the system to establish a ranking.
     */
    public int returnRank(Integer userId) {
        // 1. Get ordered list of users with their max marks directly from the repository using a custom query
        List<UserMaxMarksProjection> userMaxMarksList = reportRepository.findUserMaxMarksOrderedByMarksObtainedDesc(); // Changed method name

        if (userMaxMarksList.isEmpty()) {
            throw new RuntimeException("No reports found in the system to determine rank.");
        }

        // 2. Find the target user's maximum marks from the processed list
        Optional<UserMaxMarksProjection> currentUserMaxMarks = userMaxMarksList.stream()
                .filter(umm -> umm.getUserId().equals(userId))
                .findFirst();

        // If no reports found for the given user ID in the system
        if (currentUserMaxMarks.isEmpty()) {
            throw new ResourceNotFoundException("No reports found for the given userId to determine rank.");
        }

        // Get the highest marks of the user whose rank we are trying to find
        int targetUserMaxMarks = currentUserMaxMarks.get().getMaxMarks();

        // 3. Calculate the rank by iterating through the sorted list, handling ties
        int rank = 1; // Initialize rank to 1
        int previousMarks = -1; // Keep track of the marks of the previous user to handle ties correctly

        for (int i = 0; i < userMaxMarksList.size(); i++) {
            UserMaxMarksProjection current = userMaxMarksList.get(i);
            // If the current user's marks are less than the previous user's marks,
            // it means we've moved to a new rank level.
            if (i > 0 && current.getMaxMarks() < previousMarks) {
                rank = i + 1; // The rank becomes the current position + 1
            }
            // If we found the target user and their max marks match, return their current rank
            if (current.getUserId().equals(userId) && current.getMaxMarks() == targetUserMaxMarks) {
                return rank;
            }
            previousMarks = current.getMaxMarks(); // Update previous marks for the next iteration
        }

        // This line should ideally not be reached if previous checks are robust,
        // but it acts as a final fallback for unexpected scenarios.
        throw new ResourceNotFoundException("Could not determine rank for userId: " + userId);
    }

    /**
     * Counts the number of distinct exams a user has taken.
     *
     * @param userId The ID of the user.
     * @return The count of distinct exam IDs for the user.
     * @throws ResourceNotFoundException if no exams are found for the given user ID.
     */
    public long countExamsByUserId(Integer userId) {
        long count = reportRepository.countDistinctExamIdsByUserId(userId);
        if (count == 0) {
            throw new ResourceNotFoundException("No exams found for user ID: " + userId);
        }
        return count;
    }
}
