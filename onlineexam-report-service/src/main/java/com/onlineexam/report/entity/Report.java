package com.onlineexam.report.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@NoArgsConstructor   //Default constructor
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reportId;

    private Integer examId; // Referencing a minimal Exam entity in this service
    private String examTitle; // Added examTitle
    private Integer userId; // Referencing a minimal User entity in this service
    private String username; // Added username field
    private Integer maxMarks; // Added maxMarks field from exam

    private Integer marksObtained; // Changed from totalMarks to marksObtained
    private String performanceMetrics;
}
