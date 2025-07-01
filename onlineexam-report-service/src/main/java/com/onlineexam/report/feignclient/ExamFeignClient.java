package com.onlineexam.report.feignclient;

import com.onlineexam.report.dto.ExamResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "onlineexam-admin-service", url = "${onlineexam-admin-service.url}")
public interface ExamFeignClient {

    @GetMapping("/api/admin/exams/{id}")
    ResponseEntity<ExamResponseDTO> getExamById(@PathVariable("id") Integer id);
}
