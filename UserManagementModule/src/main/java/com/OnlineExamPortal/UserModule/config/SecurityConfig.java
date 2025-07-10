package com.OnlineExamPortal.UserModule.config; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService; // This would typically be your CustomUserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security configuration class for the User Service.
 * Configures security filters, authentication providers, and authorization rules.
 */
@Configuration // Marks this class as a Spring configuration class
@EnableWebSecurity // Enables Spring Security's web security support
public class SecurityConfig {

    @Autowired // Injects the custom JWT authentication filter
    private JwtAuthFilter jwtAuthFilter;

    @Autowired // Injects the custom UserDetailsService (our CustomUserDetailsService)
    private UserDetailsService userDetailsService;

     

    /**
     * Defines the SecurityFilterChain, which configures HTTP security.
     * @param http HttpSecurity object to configure security.
     * @return A configured SecurityFilterChain.
     * @throws Exception If an error occurs during configuration.
     */  
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.disable())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/user/register",
                    "/user/login",
                    "/user/{userId}/profile",
                    "/user/{id}",
                    "/user/{id}/role",
                    "/user/users"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    
    
    /**
     * Defines the PasswordEncoder bean. Uses BCryptPasswordEncoder for strong password hashing.
     * @return An instance of BCryptPasswordEncoder.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Defines the AuthenticationProvider. Uses DaoAuthenticationProvider, which retrieves
     * user details from a UserDetailsService and authenticates with a PasswordEncoder.
     * @return An instance of DaoAuthenticationProvider.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService); // Set our custom UserDetailsService
        authenticationProvider.setPasswordEncoder(passwordEncoder()); // Set our password encoder
        return authenticationProvider;
    }

    /**
     * Defines the AuthenticationManager bean. It is responsible for authenticating
     * Authentication objects (e.g., from login attempts).
     * @param config The AuthenticationConfiguration from which to get the AuthenticationManager.
     * @return An instance of AuthenticationManager.
     * @throws Exception If an error occurs during manager retrieval.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
   
        

}