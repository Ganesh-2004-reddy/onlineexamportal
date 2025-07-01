package com.onlineexam.report.feignclient;

import com.onlineexam.report.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "onlineexam-user-service", url = "${onlineexam-user-service.url}")
public interface UserFeignClient {

    @GetMapping("/user/{id}/profile") // Assuming this endpoint returns UserDTO with username
    ResponseEntity<UserDTO> getUserById(@PathVariable("id") Integer id);
}
