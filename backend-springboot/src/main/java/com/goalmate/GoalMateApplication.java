package com.goalmate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GoalMateApplication {
    public static void main(String[] args) {
        SpringApplication.run(GoalMateApplication.class, args);
        System.out.println("🚀 GoalMate Backend is running on http://localhost:8000");
    }
}