package com.academic.pathway.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    /**
     * Sends an academic pathway recommendation email. Falls back to logging if JavaMailSender is not configured.
     */
    public void sendRecommendationEmail(String toEmail, String fullName, String pathway, String reason) {
        log.info("Preparing recommendation email for: {} <{}>", fullName, toEmail);

        String subject = "Your Academic Pathway Recommendation: " + pathway;
        String emailContent = String.format(
                "Dear %s,\n\n" +
                "Thank you for using the Academic Pathway Recommendation Engine.\n\n" +
                "Based on your profile, your recommended pathway is: %s\n\n" +
                "Detailed Analysis:\n%s\n\n" +
                "Best regards,\n" +
                "Academic Pathway Advisory Team",
                fullName, pathway, reason
        );

        if (mailSender != null && fromEmail != null && !fromEmail.trim().isEmpty()) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(emailContent);
                mailSender.send(message);
                log.info("Recommendation email successfully sent to {}", toEmail);
            } catch (Exception e) {
                log.error("Failed to send recommendation email to {}. Error: {}", toEmail, e.getMessage());
            }
        } else {
            log.warn("JavaMailSender is not configured or 'spring.mail.username' is missing. Falling back to console mail logging.");
            log.info("\n--- [MOCK EMAIL SENT] ---\nTo: {}\nSubject: {}\nBody:\n{}\n-------------------------", 
                    toEmail, subject, emailContent);
        }
    }
}
