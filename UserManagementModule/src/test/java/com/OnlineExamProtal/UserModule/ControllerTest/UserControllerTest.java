//package com.OnlineExamProtal.UserModule.ControllerTest;
//
//import com.OnlineExamPortal.UserModule.Controller.UserController;
//import com.OnlineExamPortal.UserModule.DTO.*;
//import com.OnlineExamPortal.UserModule.Model.Role;
//import com.OnlineExamPortal.UserModule.Service.UserService;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.ResponseEntity;
//
//import java.util.Arrays;
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.Mockito.doNothing;
//import static org.mockito.Mockito.times;
//import static org.mockito.Mockito.verify;
//import static org.mockito.Mockito.when;
//
//
//@SpringBootTest
//public class UserControllerTest {
//
//    @Mock
//    private UserService userService;
//
//    @Mock
//    private UserController userController;
//
//    public UserControllerTest() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    public void testRegisterNewUser() {
//        UserRegistrationDTO registrationDTO = new UserRegistrationDTO("John", "john@example.com", "password","password");
//        UserDTO userDTO = new UserDTO(1, "John", "john@example.com", null, null);
//
//        when(userService.registerUser(registrationDTO)).thenReturn(userDTO);
//
//        ResponseEntity<UserDTO> response = userController.registerNewUser(registrationDTO);
//        assertEquals(200, response.getStatusCodeValue());
//        assertEquals("john@example.com", response.getBody().getEmail());
//    }
//
//    @Test
//    public void testLoginUser() {
//        LoginDTO loginDTO = new LoginDTO("john@example.com", "password");
//        UserDTO userDTO = new UserDTO(1, "John", "john@example.com", null, null);
//
//        when(userService.loginUser(loginDTO)).thenReturn(userDTO);
//
//        ResponseEntity<UserDTO> response = userController.loginUser(loginDTO);
//        assertEquals(200, response.getStatusCodeValue());
//        assertEquals("John", response.getBody().getName());
//    }
//
//    @Test
//    public void testFindAllUsers() {
//        UserRequestDTO user1 = new UserRequestDTO(1, "John", "john@example.com", null);
//        UserRequestDTO user2 = new UserRequestDTO(2, "Jane", "jane@example.com", null);
//
//        when(userService.findAllUsers()).thenReturn(Arrays.asList(user1, user2));
//
//        ResponseEntity<List<UserRequestDTO>> response = userController.findAllUsers();
//        assertEquals(2, response.getBody().size());
//    }
//
//    @Test
//    public void testGetUserById() {
//        UserRequestDTO user = new UserRequestDTO(1, "John", "john@example.com", null);
//
//        when(userService.getUserById(1)).thenReturn(user);
//
//        ResponseEntity<UserRequestDTO> response = userController.getUserById(1);
//        assertEquals("John", response.getBody().getName());
//    }
//
//    @Test
//    public void testUpdateUser() {
//        UserRegistrationDTO dto = new UserRegistrationDTO("John Updated", "john.updated@example.com", "newpass", null);
//        UserDTO updatedUser = new UserDTO(1, "John Updated", "john.updated@example.com", null, null);
//
//        when(userService.updateUser(1, dto)).thenReturn(updatedUser);
//
//        ResponseEntity<UserDTO> response = userController.updateUser(1, dto);
//        assertEquals("John Updated", response.getBody().getName());
//    }
//
//    @Test
//    public void testAssignRoleToUser() {
//        doNothing().when(userService).assignRole(1, Role.ADMIN);
//
//        userController.assignRoleToUser(1, Role.ADMIN);
//        verify(userService, times(1)).assignRole(1, Role.ADMIN);
//    }
//
//    @Test
//    public void testGetUserProfileById() {
//        UserRequestDTO profile = new UserRequestDTO(1, "John", "john@example.com", null);
//
//        when(userService.getUserProfileById(1)).thenReturn(profile);
//
//        UserRequestDTO response = userController.getUserProfileById(1);
//        assertEquals("john@example.com", response.getEmail());
//    }
//}
