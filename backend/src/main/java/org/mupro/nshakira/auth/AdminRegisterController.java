package org.mupro.nshakira.auth;

import org.mupro.nshakira.user.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AdminRegisterController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthResponse> registerAdmin(@RequestBody RegisterRequest request) {
        RegisterRequest adminRequest = new RegisterRequest(
                request.name(),
                request.email(),
                request.password(),
                Role.ADMIN
        );
        return ResponseEntity.ok(authService.register(adminRequest));
    }
}
