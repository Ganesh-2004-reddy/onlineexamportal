package com.onlineexam.report.dto; // Changed package to match report-service DTOs

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportSummaryDTO {
    private Integer reportId;
    private Integer examId;
    private String examTitle; // Added examTitle
    private Integer userId;
    private String username; // Added username
    private Integer maxMarks; // Added maxMarks
    private Integer marksObtained; // Changed from totalMarks to marksObtained
    private String performanceMetrics;
}
