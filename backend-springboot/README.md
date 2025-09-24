# GoalMate Backend

Spring Boot REST API for the GoalMate task management application.

## Prerequisites
- Java 21 or higher
- Maven 3.6+
- Gmail account for email functionality

## Setup

1. **Configure Email**
   
   Create `.env` file in the root directory:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

2. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```
   
   Server starts at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /verify-email` - Verify email with token
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `POST /resend-verification` - Resend verification email

### Tasks
- `GET /tasks` - Get user's tasks
- `POST /tasks` - Create new task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## Features

- JWT Authentication
- Email verification and password reset
- SQLite database
- CORS enabled for frontend
- Password validation
- Secure password hashing

## Tech Stack

- Spring Boot 3.2.0
- Spring Security
- JWT
- SQLite
- JavaMail

## Production Deployment

1. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Build Application**
   ```bash
   mvn clean package -DskipTests
   ```

3. **Run with Production Profile**
   ```bash
   java -jar -Dspring.profiles.active=prod target/goalmate-backend-1.0.0.jar
   ```

## Environment Variables

- `JWT_SECRET` - Strong secret key (required)
- `EMAIL_USER` - Gmail address (required)
- `EMAIL_PASSWORD` - Gmail app password (required)
- `DATABASE_PATH` - Database file location
- `CORS_ORIGINS` - Allowed frontend domains
- `PORT` - Server port (default: 8000)