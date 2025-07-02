package com.onlineexam.report.service;

import com.onlineexam.report.dto.ExamResponseDTO;
import com.onlineexam.report.dto.ReportSummaryDTO;
import com.onlineexam.report.dto.ResponseSummaryDTO;
import com.onlineexam.report.dto.UserDTO;
import com.onlineexam.report.entity.Report;
import com.onlineexam.report.exception.ResourceNotFoundException;
import com.onlineexam.report.feignclient.ExamFeignClient;
import com.onlineexam.report.feignclient.ResponseFeignClient;
import com.onlineexam.report.feignclient.UserFeignClient;
import com.onlineexam.report.repository.ReportRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReportServiceTest {

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private ResponseFeignClient responseFeignClient;

    @Mock
    private ExamFeignClient examFeignClient;

    @Mock
    private UserFeignClient userFeignClient;

    @InjectMocks
    private ReportService reportService;

    private Report report;
    private ReportSummaryDTO reportSummaryDTO;
    private ExamResponseDTO examResponseDTO;
    private UserDTO userDTO;
    private ResponseSummaryDTO responseSummaryDTO1;
    private ResponseSummaryDTO responseSummaryDTO2;

    @BeforeEach
    void setUp() {
        // Initialize common test data
        report = new Report();
        report.setReportId(1);
        report.setUserId(101);
        report.setExamId(201);
        report.setExamTitle("Math Exam");
        report.setUsername("testuser");
        report.setMaxMarks(100);
        report.setMarksObtained(75);
        report.setPerformanceMetrics("First Class");

        reportSummaryDTO = ReportSummaryDTO.builder()
                .reportId(1)
                .userId(101)
                .examId(201)
                .examTitle("Math Exam")
                .username("testuser")
                .maxMarks(100)
                .marksObtained(75)
                .performanceMetrics("First Class")
                .build();

        examResponseDTO = new ExamResponseDTO(201, "Math Exam", "Description", 60, 100);
        userDTO = new UserDTO();
        userDTO.setUserId(101);
        userDTO.setName("testuser");
        userDTO.setEmail("test@example.com");

        responseSummaryDTO1 = new ResponseSummaryDTO(1, 10, "A", 40);
        responseSummaryDTO2 = new ResponseSummaryDTO(2, 11, "B", 35);
    }

    @Test
    void generateReport_Success_FirstClass() {
        // Arrange
        List<ResponseSummaryDTO> responses = Arrays.asList(responseSummaryDTO1, responseSummaryDTO2); // Total 75 marks
        when(responseFeignClient.getResponsesByUserAndExam(anyInt(), anyInt()))
                .thenReturn(new ResponseEntity<>(responses, HttpStatus.OK));
        when(examFeignClient.getExamById(anyInt()))
                .thenReturn(new ResponseEntity<>(examResponseDTO, HttpStatus.OK));
        when(userFeignClient.getUserById(anyInt()))
                .thenReturn(new ResponseEntity<>(userDTO, HttpStatus.OK));
        when(reportRepository.save(any(Report.class))).thenReturn(report);

        // Act
        ReportSummaryDTO result = reportService.generateReport(101, 201);

        // Assert
        assertNotNull(result);
        assertEquals(101, result.getUserId());
        assertEquals(201, result.getExamId());
        assertEquals("testuser", result.getUsername());
        assertEquals("Math Exam", result.getExamTitle());
        assertEquals(100, result.getMaxMarks());
        assertEquals(75, result.getMarksObtained()); // 40 + 35 = 75
        assertEquals("First Class", result.getPerformanceMetrics()); // 75 >= 100 * 0.6 (60)
        verify(reportRepository, times(1)).save(any(Report.class));
    }

    @Test
    void generateReport_ResponseFeignClientError() {
        // Arrange
        when(responseFeignClient.getResponsesByUserAndExam(anyInt(), anyInt()))
                .thenThrow(new RuntimeException("Feign client error"));

        // Act & Assert
        RuntimeException thrown = assertThrows(RuntimeException.class, () ->
                reportService.generateReport(101, 201));
        assertTrue(thrown.getMessage().contains("Error communicating with Response Service"));
    }

    @Test
    void getReportByUserIdAndExamId_Success() {
        // Arrange
        when(reportRepository.findByUserIdAndExamId(anyInt(), anyInt())).thenReturn(Optional.of(report));

        // Act
        Optional<ReportSummaryDTO> result = reportService.getReportByUserIdAndExamId(101, 201);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(reportSummaryDTO.getUserId(), result.get().getUserId());
        assertEquals(reportSummaryDTO.getExamId(), result.get().getExamId());
    }

    @Test
    void getReportByUserIdAndExamId_NotFound() {
        // Arrange
        when(reportRepository.findByUserIdAndExamId(anyInt(), anyInt())).thenReturn(Optional.empty());

        // Act
        Optional<ReportSummaryDTO> result = reportService.getReportByUserIdAndExamId(101, 201);

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    void getAllReports_Success() {
        // Arrange
        List<Report> reports = Arrays.asList(report);
        when(reportRepository.findAll()).thenReturn(reports);

        // Act
        List<ReportSummaryDTO> result = reportService.getAllReports();

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void getAllReports_NotFound() {
        // Arrange
        when(reportRepository.findAll()).thenReturn(Collections.emptyList());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> reportService.getAllReports());
    }

    @Test
    void deleteReports_ByUserIdAndExamId_Success() {
        // Arrange
        when(reportRepository.findByUserIdAndExamId(anyInt(), anyInt())).thenReturn(Optional.of(report));
        doNothing().when(reportRepository).delete(any(Report.class));

        // Act
        boolean result = reportService.deleteReports(101, 201);

        // Assert
        assertTrue(result);
        verify(reportRepository, times(1)).delete(report);
    }

    @Test
    void deleteReports_ByUserIdAndExamId_NotFound() {
        // Arrange
        when(reportRepository.findByUserIdAndExamId(anyInt(), anyInt())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> reportService.deleteReports(101, 201));
        verify(reportRepository, never()).delete(any(Report.class));
    }
}
