package com.onlineexam.admin.service;

import com.onlineexam.admin.Exception.CustomException;
import com.onlineexam.admin.client.MappingFeignClient;
import com.onlineexam.admin.dto.ExamDTO;
import com.onlineexam.admin.dto.ExamResponseDTO;
import com.onlineexam.admin.entity.Exam;
import com.onlineexam.admin.repository.ExamRepository;

import feign.FeignException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamService {
    @Autowired
    private ExamRepository examRepository;
    
    @Autowired
    private MappingFeignClient mappingFeignClient;

    public ExamResponseDTO createExam(ExamDTO examDTO) {
    	//Convert DTO to Entity
        Exam exam = new Exam();
        exam.setTitle(examDTO.getTitle());
        exam.setDescription(examDTO.getDescription());
        exam.setDuration(examDTO.getDuration());
        exam.setTotalMarks(examDTO.getTotalMarks());
        //Save Entity to Database
        Exam savedExam = examRepository.save(exam);
        //Convert entity back to Response DTO
        return convertToExamResponseDTO(savedExam);
    }

    public List<ExamResponseDTO> getAllExams() {
    	//Get all entities from DB
        return examRepository.findAll().stream()
        		//Convert each entity to DTO using stream API
                .map(this::convertToExamResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<ExamResponseDTO> getExamById(Integer id) {
    	//Find Entity by Id
        return examRepository.findById(id)
        		//If found,convert to DTO
                .map(this::convertToExamResponseDTO);
    }

    public ExamResponseDTO updateExam(Integer id, ExamDTO examDetails) {
        Optional<Exam> optionalExam = examRepository.findById(id);
        if (optionalExam.isPresent()) {
            Exam existingExam = optionalExam.get();
            existingExam.setTitle(examDetails.getTitle());
            existingExam.setDescription(examDetails.getDescription());
            existingExam.setDuration(examDetails.getDuration());
            existingExam.setTotalMarks(examDetails.getTotalMarks());
            //Update fields from DTO
            Exam updatedExam = examRepository.save(existingExam);
            return convertToExamResponseDTO(updatedExam);
        } else {
            return null; 
        }
    }

    public boolean deleteExam(Integer id) {
        if (examRepository.existsById(id)) {
            examRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean examExists(Integer examId) {
        return examRepository.existsById(examId);
    }

    // Helper method to convert Entity to DTO
    private ExamResponseDTO convertToExamResponseDTO(Exam exam) {
        return new ExamResponseDTO(
                exam.getExamId(),
                exam.getTitle(),
                exam.getDescription(),
                exam.getDuration(),
                exam.getTotalMarks()
        );
    }

	public String deleteExamById(Integer examId) {
		// TODO Auto-generated method stub
		 try {
	            mappingFeignClient.deleteMappingsByExamId(examId);
	        } catch (FeignException e) {
	            if (e.status() != 404) {
	                throw new CustomException("Failed to delete mappings: " + e.getMessage());
	            }
	            // Log and continue if no mappings found
	            System.out.println("No mappings found for exam ID " + examId + ", proceeding with exam deletion.");
	        }

	        // 2. Delete exam entity
	        if (!examRepository.existsById(examId)) {
	            throw new CustomException("Exam not found with ID: " + examId);
	        }

	        examRepository.deleteById(examId);
	        return "Exam deleted successfully";
	}
    
    
}