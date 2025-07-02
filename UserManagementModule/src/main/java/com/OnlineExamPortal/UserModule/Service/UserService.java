
package com.OnlineExamPortal.UserModule.Service;

import com.OnlineExamPortal.UserModule.DTO.LoginDTO;
import com.OnlineExamPortal.UserModule.DTO.UserDTO;
import com.OnlineExamPortal.UserModule.DTO.UserRegistrationDTO;
import com.OnlineExamPortal.UserModule.DTO.UserRequestDTO;
import com.OnlineExamPortal.UserModule.Model.Role;

import java.util.List;

public interface UserService {
    List<UserRequestDTO> findAllUsers();
    UserRequestDTO getUserById(Integer l);
    UserDTO registerUser(UserRegistrationDTO dto);
    UserDTO loginUser(LoginDTO dto);
    UserDTO updateUser(Integer userId, UserRegistrationDTO dto);
    void assignRole(Integer userId, Role role);
	UserRequestDTO getUserProfileById(Integer id);
}
