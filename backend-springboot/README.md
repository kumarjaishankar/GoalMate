# GoalMate Spring Boot Backend

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Run the Application

```bash
# Navigate to Spring Boot backend
cd backend-springboot

# Run with Maven
mvn spring-boot:run

# Or build and run JAR
mvn clean package
java -jar target/goalmate-backend-1.0.0.jar
```

### Configuration

Create `.env` file in the root directory:
```properties
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## 📋 API Endpoints

All endpoints are identical to the FastAPI version:

### Authentication
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /verify-email` - Verify email
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `POST /resend-verification` - Resend verification

### Tasks (Coming Next)
- `GET /tasks/` - List user tasks
- `POST /tasks/` - Create task
- `GET /tasks/{id}` - Get task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## 🔧 Features

✅ **Email Verification** - OTP-based registration
✅ **Password Reset** - Secure email-based reset
✅ **JWT Authentication** - Stateless authentication
✅ **Password Validation** - Strong password requirements
✅ **CORS Support** - Frontend integration ready
✅ **SQLite Database** - Same database as FastAPI
✅ **Debug Logging** - Console output for development

## 🎯 Migration Status

**✅ Completed:**
- Project structure
- Database entities (User, Task)
- Email service
- Authentication endpoints
- Security configuration
- JWT service

**🔄 Next Steps:**
- Task management endpoints
- Analytics endpoints
- Error handling
- Testing

## 🔄 Switching from FastAPI

1. **Stop FastAPI backend**
2. **Start Spring Boot backend:** `mvn spring-boot:run`
3. **Frontend works unchanged** - same API endpoints!

The Spring Boot backend is 100% compatible with your existing frontend.