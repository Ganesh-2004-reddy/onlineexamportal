package com.onlineexam.report.dto; // Changed package to match report-service DTOs

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class UserDTO {
    private Integer userId;
    private String name; // This will be used as username
    private String email;
    // private Role role; // Role might not be needed in report service
    // private String token; // Token might not be needed in report service
}
