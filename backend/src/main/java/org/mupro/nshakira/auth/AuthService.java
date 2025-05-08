package org.mupro.nshakira.auth;

import org.mupro.nshakira.email.EmailService;
import org.mupro.nshakira.exception.ResourceNotFoundException;
import org.mupro.nshakira.security.JwtService;
import org.mupro.nshakira.token.Token;
import org.mupro.nshakira.token.TokenRepository;
import org.mupro.nshakira.user.Role;
import org.mupro.nshakira.user.User;
import org.mupro.nshakira.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class AuthService {
    @Autowired private UserRepository userRepository;
    @Autowired private TokenRepository tokenRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;
    @Autowired private EmailService emailService;

    public AuthResponse register(RegisterRequest request){
        Role role = request.role() == null ? Role.USER : request.role();

        User user = new User(
                request.name(),
                request.email(),
                passwordEncoder.encode(request.password()),
                role,
                true,
                ""
        );
        userRepository.save(user);
        
        var jwt = jwtService.generateToken(user);
        saveUserToken(user, jwt);
        
        return AuthResponse.fromUser(user, jwt);
    }

    public AuthResponse login(AuthRequest request){
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->new UsernameNotFoundException("Invalid email"));

        if(!passwordEncoder.matches(request.password(), user.getPassword())){
            throw new BadCredentialsException("Invalid password");
        }

        var jwt = jwtService.generateToken(user);

        revokeAllTokens(user);
        saveUserToken(user, jwt);
        
        return AuthResponse.fromUser(user, jwt);
    }

    public void logout(String jwt) {
        Token storedToken = tokenRepository.findByToken(jwt)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found."));
        storedToken.setRevoked(true);
        storedToken.setExpired(true);
        tokenRepository.save(storedToken);
    }

    public void saveUserToken(User user, String jwtToken){
        Token token = new Token(jwtToken, false, false, user);
        tokenRepository.save(token);
    }

    private String generateOtp(){
        return String.valueOf((int) (Math.random() * 900000 + 10000));
    }

    private void revokeAllTokens(User user){
        List<Token> validUserTokens = tokenRepository.findAllValidTokenByUser(user);
        if(validUserTokens.isEmpty()){
            return;
        }

        for(Token token : validUserTokens){
            token.setExpired(true);
            token.setRevoked(true);
        }
        tokenRepository.saveAll(validUserTokens);
    }

    public AuthResponse verifyOtp(OtpVerificationRequest request) {
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        if (!request.otp().equals(user.getOtp())) {
            throw new BadCredentialsException("Invalid OTP");
        }
        
        // Check if OTP is expired (optional, 10 minutes expiry)
        LocalDateTime expiryTime = user.getOtpGeneratedAt().plusMinutes(10);
        if (LocalDateTime.now().isAfter(expiryTime)) {
            throw new BadCredentialsException("OTP has expired");
        }
        
        // Enable the user and generate JWT
        user.setEnabled(true);
        userRepository.save(user);
        
        var jwt = jwtService.generateToken(user);
        
        revokeAllTokens(user);
        saveUserToken(user, jwt);
        
        return AuthResponse.fromUser(user, jwt);
    }
}