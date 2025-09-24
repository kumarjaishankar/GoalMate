package com.goalmate.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String emailUser;

    @Value("${spring.mail.password:}")
    private String emailPassword;
    
    @PostConstruct
    public void init() {
        logger.info("Email Service initialized");
        logger.debug("Email user configured: {}", emailUser != null && !emailUser.isEmpty() ? "YES" : "NO");
        logger.debug("Email password configured: {}", emailPassword != null && !emailPassword.isEmpty() ? "YES" : "NO");
    }

    public String generateToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public boolean sendVerificationEmail(String toEmail, String token, String username) {
        logger.info("Sending verification email to: {}", toEmail.replaceAll("[\r\n]", ""));
        
        try {
            String verificationUrl = "http://localhost:5173/verify-email?token=" + token;
            
            if (emailUser == null || emailUser.isEmpty() || emailPassword == null || emailPassword.isEmpty()) {
                logger.warn("Email not configured - displaying verification link in console");
                logger.info("VERIFICATION LINK: {}", verificationUrl);
                logger.info("Copy this link and paste it in your browser to verify your email");
                return true;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(emailUser);
            helper.setTo(toEmail);
            helper.setSubject("GoalMate - Verify Your Email");

            String body = String.format("""
                <html>
                <body>
                    <h2>Welcome to GoalMate, %s!</h2>
                    <p>Please verify your email address by clicking the link below:</p>
                    <a href="%s" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
                    <p>Or copy and paste this link in your browser:</p>
                    <p>%s</p>
                    <p>This link will expire in 24 hours.</p>
                </body>
                </html>
                """, username, verificationUrl, verificationUrl);

            helper.setText(body, true);
            mailSender.send(message);
            return true;

        } catch (MessagingException e) {
            logger.error("Failed to send verification email: {}", e.getMessage());
            return false;
        }
    }

    public boolean sendResetEmail(String toEmail, String token, String username) {
        try {
            String resetUrl = "http://localhost:5173/reset-password?token=" + token;
            
            if (emailUser == null || emailUser.isEmpty() || emailPassword == null || emailPassword.isEmpty()) {
                logger.warn("Email not configured - displaying reset link in console");
                logger.info("PASSWORD RESET LINK: {}", resetUrl);
                logger.info("Copy this link and paste it in your browser to reset password");
                return true;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(emailUser);
            helper.setTo(toEmail);
            helper.setSubject("GoalMate - Password Reset");

            String body = String.format("""
                <html>
                <body>
                    <h2>Password Reset Request</h2>
                    <p>Hi %s,</p>
                    <p>You requested a password reset. Click the link below to reset your password:</p>
                    <a href="%s" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>Or copy and paste this link in your browser:</p>
                    <p>%s</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </body>
                </html>
                """, username, resetUrl, resetUrl);

            helper.setText(body, true);
            mailSender.send(message);
            return true;

        } catch (MessagingException e) {
            logger.error("Failed to send password reset email: {}", e.getMessage());
            return false;
        }
    }
}