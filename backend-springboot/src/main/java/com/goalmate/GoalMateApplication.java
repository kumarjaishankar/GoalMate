package com.goalmate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GoalMateApplication {
    private static final Logger logger = LoggerFactory.getLogger(GoalMateApplication.class);
    
    public static void main(String[] args) {
        SpringApplication.run(GoalMateApplication.class, args);
        logger.info("GoalMate Backend is running on http://localhost:8000");
    }
}