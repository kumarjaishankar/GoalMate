package com.goalmate.controller;

import com.goalmate.dto.*;
import com.goalmate.entity.User;
import com.goalmate.repository.UserRepository;
import com.goalmate.service.EmailService;
import com.goalmate.service.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> root() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "GoalMate Backend is running");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody UserCreateRequest request) {
        logger.info("Registration attempt for username: {}", request.getUsername().replaceAll("[\r\n]", ""));

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already registered");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String verificationToken = emailService.generateToken();
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getUsername(), request.getEmail(), hashedPassword);
        user.setVerificationToken(verificationToken);

        user = userRepository.save(user);
        logger.info("User created successfully with ID: {}", user.getId());

        boolean emailSent = emailService.sendVerificationEmail(request.getEmail(), verificationToken, request.getUsername());
        if (!emailSent) {
            throw new RuntimeException("Failed to send verification email");
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration successful. Please check your email to verify your account.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestParam String username, @RequestParam String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPasswordHash())) {
            throw new RuntimeException("Incorrect username or password");
        }

        User user = userOpt.get();
        if (!user.getIsVerified()) {
            throw new RuntimeException("Please verify your email before logging in");
        }

        String token = jwtService.generateToken(user.getUsername());

        Map<String, String> response = new HashMap<>();
        response.put("access_token", token);
        response.put("token_type", "bearer");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        if (token == null || token.trim().isEmpty()) {
            throw new RuntimeException("Token is required");
        }
        Optional<User> userOpt = userRepository.findByVerificationToken(token);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid verification token");
        }

        User user = userOpt.get();
        user.setIsVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Email verified successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "If the email exists, a reset link has been sent");
            return ResponseEntity.ok(response);
        }

        User user = userOpt.get();
        if (!user.getIsVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        String resetToken = emailService.generateToken();
        LocalDateTime resetExpires = LocalDateTime.now().plusHours(1);

        user.setResetToken(resetToken);
        user.setResetTokenExpires(resetExpires);
        userRepository.save(user);

        boolean emailSent = emailService.sendResetEmail(email, resetToken, user.getUsername());

        if (!emailSent) {
            throw new RuntimeException("Failed to send reset email");
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "If the email exists, a reset link has been sent");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("new_password");
        
        if (token == null || token.trim().isEmpty()) {
            throw new RuntimeException("Token is required");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("New password is required");
        }

        Optional<User> userOpt = userRepository.findByResetToken(token);

        if (userOpt.isEmpty() || userOpt.get().getResetTokenExpires() == null) {
            throw new RuntimeException("Invalid reset token");
        }

        User user = userOpt.get();
        if (LocalDateTime.now().isAfter(user.getResetTokenExpires())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpires(null);
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset successfully");
        return ResponseEntity.ok(response);
    }



    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, String>> resendVerification(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "If the email exists, a verification link has been sent");
            return ResponseEntity.ok(response);
        }

        User user = userOpt.get();
        if (user.getIsVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        String verificationToken = emailService.generateToken();
        user.setVerificationToken(verificationToken);
        userRepository.save(user);

        boolean emailSent = emailService.sendVerificationEmail(email, verificationToken, user.getUsername());

        if (!emailSent) {
            throw new RuntimeException("Failed to send verification email");
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "If the email exists, a verification link has been sent");
        return ResponseEntity.ok(response);
    }
}