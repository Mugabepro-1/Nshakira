package org.mupro.nshakira.auth;

import org.mupro.nshakira.user.User;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private String token;
    private String message;
    private UserDTO user;

    // Constructor for regular response with message
    public AuthResponse(String message) {
        this.message = message;
    }

    // Constructor for login response with token
    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }

    // Default constructor
    public AuthResponse() {
    }

    // Create from a user entity
    public static AuthResponse fromUser(User user, String token) {
        UserDTO userDTO = new UserDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().toString()
        );
        return new AuthResponse(token, userDTO);
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    // DTO for User data to be returned in response
    public static class UserDTO {
        private Long id;
        private String name;
        private String email;
        private String role;

        public UserDTO(Long id, String name, String email, String role) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        // Getters and setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
