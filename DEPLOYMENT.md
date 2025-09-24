# GoalMate Deployment Guide

## Production Deployment Checklist

### Backend Deployment

1. **Environment Setup**
   ```bash
   cp backend-springboot/.env.example backend-springboot/.env
   # Configure all required environment variables
   ```

2. **Security Configuration**
   - Generate strong JWT secret (minimum 32 characters)
   - Configure Gmail app password for email service
   - Set production CORS origins
   - Use HTTPS in production

3. **Database Setup**
   - Ensure database directory exists and is writable
   - Consider database backups for production

4. **Build and Deploy**
   ```bash
   cd backend-springboot
   mvn clean package -DskipTests
   java -jar -Dspring.profiles.active=prod target/goalmate-backend-1.0.0.jar
   ```

### Frontend Deployment

1. **Configuration**
   ```bash
   cp frontend/.env.example frontend/.env
   # Set VITE_API_URL to your backend domain
   ```

2. **Build and Deploy**
   ```bash
   cd frontend
   npm install
   npm run build
   # Deploy dist/ folder to your web server
   ```

### Required Environment Variables

#### Backend (.env)
- `JWT_SECRET` - Strong secret key (required)
- `EMAIL_USER` - Gmail address (required)
- `EMAIL_PASSWORD` - Gmail app password (required)
- `DATABASE_PATH` - Database file location
- `CORS_ORIGINS` - Allowed frontend domains

#### Frontend (.env)
- `VITE_API_URL` - Backend API URL

### Security Recommendations

1. **Use HTTPS** for all production traffic
2. **Strong JWT Secret** - Generate using: `openssl rand -base64 32`
3. **Gmail App Password** - Enable 2FA and generate app-specific password
4. **CORS Configuration** - Only allow your frontend domain
5. **Database Security** - Ensure proper file permissions
6. **Regular Updates** - Keep dependencies updated

### Monitoring

- Check application logs regularly
- Monitor email delivery success
- Set up health checks for the API
- Monitor database file size and performance