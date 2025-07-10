
package com.OnlineExamPortal.UserModule.Controller;

import com.OnlineExamPortal.UserModule.DTO.LoginDTO;
import com.OnlineExamPortal.UserModule.DTO.UserDTO;
import com.OnlineExamPortal.UserModule.DTO.UserRegistrationDTO;
import com.OnlineExamPortal.UserModule.DTO.UserRequestDTO;
import com.OnlineExamPortal.UserModule.Exception.CustomException;
import com.OnlineExamPortal.UserModule.Model.Role;
import com.OnlineExamPortal.UserModule.Service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * REST Controller for managing User resources.
 * Provides endpoints for user registration, login, profile management, and role assignment.
 */

@RestController
@RequestMapping("/user")
public class UserController {
	
	private static final Logger logger = LoggerFactory.getLogger(UserController.class);
	
	@Autowired
    private UserService userService;
    
    /**
     * Handles POST requests for user registration.
     * @param registrationDTO The DTO containing user registration details.
     * @return ResponseEntity with the registered user's details and 200 OK status.
     */
    
    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerNewUser(@Valid @RequestBody UserRegistrationDTO registrationDTO) {
    	logger.info("Registering new user with email: {}", registrationDTO.getEmail());
        UserDTO registeredUser = userService.registerUser(registrationDTO);
        logger.debug("Registered user details: {}", registeredUser);
        return ResponseEntity.ok(registeredUser);
    }

    /**
     * Handles POST requests for user login.
     * @param loginDTO The DTO containing user login credentials (email and password).
     * @return ResponseEntity with a JWT token upon successful login and 200 OK status.
     * @throws CustomException if authentication fails (e.g., invalid credentials).
 
     */
    
    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(@RequestBody @Valid LoginDTO loginDTO) {
    	logger.info("User login attempt with email: {}", loginDTO.getEmail());
        UserDTO user = userService.loginUser(loginDTO);
        logger.debug("Login successful for user: {}", user);
        return ResponseEntity.ok(user);
    }

    /**
     * EndPoint to get all Users
     * @return ResponseEntity with a list of UserRequestDTOs.
     */
    
    @GetMapping("/users")
    public ResponseEntity<List<UserRequestDTO>> findAllUsers() {
    	logger.info("Fetching all users");
        List<UserRequestDTO> users = userService.findAllUsers();
        logger.debug("Total users found: {}", users.size());
        return ResponseEntity.ok(users);
    }

    /**
     * EndPoint to get user by id
     * @param id The ID of the user whose profile is to be retrieved.
     * @return ResponseEntity with the user's profile details if found (200 OK).
     */
    
    @GetMapping("/{id}")
    public ResponseEntity<UserRequestDTO> getUserById(@PathVariable Integer id) {
    	logger.info("Fetching user by ID: {}", id);
        UserRequestDTO user = userService.getUserById(id);
        logger.debug("User details: {}", user);
        return ResponseEntity.ok(user);
    }
    

    /**
     * EndPoint to update the user profile
     * @param id The ID of the user to update.
     * @param dto The DTO containing the updated user details.
     * @return ResponseEntity with the updated user's details and 200 OK status.
     */
    
    @PutMapping("{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Integer id, @RequestBody @Valid UserRegistrationDTO dto) {
    	logger.info("Updating user with ID: {}", id);
        UserDTO updatedUser = userService.updateUser(id, dto);
        logger.debug("Updated user details: {}", updatedUser);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * EndPoint to update the role of a user
     * @param id The ID of the user whose role is to be updated.
     * @param role The new role to assign (as a request parameter).
     * @return ResponseEntity with a success message and 200 OK status.
     * @throws CustomException if the user is not found or the role is invalid.
     */
    
    @PutMapping("/{id}/role")
    public void assignRoleToUser(@PathVariable Integer id, @RequestParam Role role) {
    	logger.info("Assigning role '{}' to user with ID: {}", role, id);
        userService.assignRole(id, role);  
        logger.debug("Role assignment successful");
    }
    /***
     * 
     * @param id
     * @return UserRequestDTO
     */
    @GetMapping("/{id}/profile")
    public UserRequestDTO getUserProfileById(@PathVariable Integer id) {
    	logger.info("Fetching profile for user ID: {}", id);
    	return userService.getUserProfileById(id);
    }
}


