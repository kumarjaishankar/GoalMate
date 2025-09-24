# GoalMate Setup Guide

## New Features Added

### 1. Email Verification
- Users must verify their email before logging in
- Verification emails are sent during registration
- Resend verification option available

### 2. Password Reset
- Forgot password functionality with email verification
- Secure token-based password reset
- Password reset links expire in 1 hour

### 3. Password Strength Indicator
- Real-time password strength validation
- Visual strength indicator with color coding
- Requirements: 8+ chars, uppercase, lowercase, number, special char

### 4. Enhanced Security
- Email validation using proper email format
- Strong password requirements
- Secure token generation for verification and reset

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend/clean-backend
   pip install -r requirements.txt
   ```

2. **Run Database Migration**
   ```bash
   python migrate_email_verification.py
   ```

3. **Configure Email (Optional)**
   - Copy `env.example` to `.env`
   - Add your email credentials:
     ```
     SMTP_SERVER=smtp.gmail.com
     SMTP_PORT=587
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=your-app-password
     ```
   - For Gmail, use App Password instead of regular password

4. **Start Backend**
   ```bash
   python main.py
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```

## Testing Without Email Configuration

If you don't configure email settings, the system will:
- Print verification/reset links to the console
- You can copy these links and paste them in your browser
- All functionality works the same way

## New API Endpoints

- `POST /register` - Register with email verification
- `POST /verify-email` - Verify email with token
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `POST /resend-verification` - Resend verification email

## New Pages

- `/verify-email?token=...` - Email verification page
- `/reset-password?token=...` - Password reset page

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character

The password strength indicator shows:
- Red: Very Weak/Weak
- Orange: Fair
- Yellow: Good
- Green: Strong

## Security Features

- JWT tokens for authentication
- Bcrypt password hashing
- Secure token generation for email verification
- Email validation
- Password strength validation
- Token expiration (verification: 24h, reset: 1h)