package com.onlineexam.response.controller;


import com.onlineexam.response.DTO.ExamQuestionMappingDTO;

import com.onlineexam.response.service.ExamQuestionMappingService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(ExamQuestionMappingController.class)
public class ExamQuestionMappingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExamQuestionMappingService mappingService;

    @Test
    public void testMapQuestionToExam_Success() throws Exception {
        ExamQuestionMappingDTO mockDto = new ExamQuestionMappingDTO(1, 1,1); // examId = 1, questionId = 1
        when(mappingService.saveMapping(1, 1)).thenReturn(mockDto);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/exam-management/mappings/exams/1/questions/1"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.message").value("Mapping created successfully"));
    }

    // ✅ Test for GET /all
    @Test
    public void testGetAllMappings() throws Exception {
        List<ExamQuestionMappingDTO> mockList = Arrays.asList(
                new ExamQuestionMappingDTO( 1, 1,1),
                new ExamQuestionMappingDTO( 1, 2,3)
        );
        when(mappingService.getAllMappings()).thenReturn(mockList);
        
        mockMvc.perform(MockMvcRequestBuilders.get("/api/exam-management/mappings/all"))
        	.andExpect(jsonPath("$[0].examId").value(1))
        	.andExpect(jsonPath("$[0].questionId").value(1))
        	.andExpect(jsonPath("$[1].examId").value(1))
        	.andExpect(jsonPath("$[1].questionId").value(2));
    }
}

