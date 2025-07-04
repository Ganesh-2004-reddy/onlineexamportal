package com.onlineexam.response.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.onlineexam.response.DTO.ExamQuestionMappingDTO;
import com.onlineexam.response.DTO.IdResponseDTO;
import com.onlineexam.response.Exception.ResourceNotFoundException;
import com.onlineexam.response.service.ExamQuestionMappingService;

/**
 * REST Controller for managing Exam-Question mappings within the Exam Management Service.
 * This controller provides endpoints to create, retrieve, and delete mapping relationships.
 */
@RestController
@RequestMapping("/api/exam-management/mappings") // Base path for mapping endpoints
public class ExamQuestionMappingController {
    
    @Autowired
    private ExamQuestionMappingService mappingService;
    
    /**
     * Creates a new mapping between an existing exam and an existing question.
     * This endpoint is typically used by an ADMIN to configure an exam.
     *
     * @param examId The ID of the exam (from Admin Service).
     * @param questionId The ID of the question (from Question Bank Service).
     * @return ResponseEntity with the ID of the newly created mapping and a 201 Created status.
     * @throws ResourceNotFoundException if the exam or question IDs are not found by Feign clients.
     * @throws IllegalArgumentException if the mapping already exists.
     */
    
    /*
    @PostMapping("/exams/{examId}/questions/{questionId}")
    public ResponseEntity<IdResponseDTO> mapQuestionToExam(@PathVariable Integer examId,
                                                           @PathVariable Integer questionId) {
        ExamQuestionMappingDTO savedMapping = mappingService.saveMapping(examId, questionId);
        
        if (savedMapping == null || savedMapping.getExamId() == 0) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        int mappingId = savedMapping.getExamId();
        IdResponseDTO response = new IdResponseDTO(mappingId, "Mapping created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    */
    @PostMapping("/exams/{examId}/questions/{questionId}")
    public ResponseEntity<IdResponseDTO> mapQuestionToExam(@PathVariable Integer examId,
                                                           @PathVariable Integer questionId) {
        try {
            ExamQuestionMappingDTO savedMapping = mappingService.saveMapping(examId, questionId);
            int mappingId = savedMapping.getExamId();
            IdResponseDTO response = new IdResponseDTO(mappingId, "Mapping created successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new IdResponseDTO(0, ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new IdResponseDTO(0, ex.getMessage()));
        }
    }


    
    /**
     * Retrieves all exam-question mappings associated with a specific exam.
     * This is useful for an ADMIN to see which questions are part of a particular exam.
     *
     * @param examId The ID of the exam.
     * @return ResponseEntity with a list of ExamQuestionMappingDTOs for the given exam.
     * @throws ResourceNotFoundException if the exam is not found.
     */
    @GetMapping("/exam/{examId}")
    // @PreAuthorize("hasRole('ADMIN')") // Example: Restrict to admins
    public ResponseEntity<List<ExamQuestionMappingDTO>> getMappingsByExam(@PathVariable Integer examId){
        List<ExamQuestionMappingDTO> mappings = mappingService.getMappingsByExam(examId);
        return ResponseEntity.ok(mappings);
    }
    
    /**
     * Retrieves all existing exam-question mappings across all exams.
     * This is typically an ADMIN-only endpoint for overview.
     *
     * @return ResponseEntity with a list of all ExamQuestionMappingDTOs.
     */
    @GetMapping("/all")
    // @PreAuthorize("hasRole('ADMIN')") // Example: Restrict to admins
    public ResponseEntity<List<ExamQuestionMappingDTO>> getAllMappings() {
        List<ExamQuestionMappingDTO> mappings = mappingService.getAllMappings();
        return ResponseEntity.ok(mappings);
    }
    
    @PutMapping("/update/{examId}/{questionId}/{newId}")
    public ResponseEntity<String> updateMapping(@PathVariable int examId,@PathVariable int questionId,@PathVariable int newId)
    {
    	return mappingService.updateMapping(examId,questionId,newId);
    }

    /**
     * Deletes a specific exam-question mapping by its unique mapping ID.
     * This is typically an ADMIN-only endpoint to remove a question from an exam.
     *
     * @param mappingId The unique ID of the ExamQuestionMapping entry to delete.
     * @return ResponseEntity with 204 No Content if the deletion is successful.
     * @throws ResourceNotFoundException if the mapping ID is not found.
     */
 
    @DeleteMapping("/{mappingId}")
    public ResponseEntity<Map<String, String>> deleteMapping(@PathVariable Long mappingId) {
        boolean success = mappingService.deleteMapping(mappingId);
        Map<String, String> response = new HashMap<>();

        if (success) {
            response.put("message", "Mapping deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Mapping with ID " + mappingId + " not found. Deletion failed.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    
    @DeleteMapping("/exam/{examId}")
    public ResponseEntity<String> deleteMappingsByExamId(@PathVariable Integer examId) {
       return mappingService.deleteMappingsByExamId(examId);
    }
}
