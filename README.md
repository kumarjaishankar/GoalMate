# GoalMate - Task Management Application

A full-stack task management application built with Spring Boot backend and React frontend.

## Features

- ✅ User Authentication (Register/Login)
- ✅ Email Verification
- ✅ Password Reset
- ✅ Task Management (CRUD operations)
- ✅ Task Categories and Priorities
- ✅ Dashboard with Analytics
- ✅ Responsive UI with Dark/Light themes

## Tech Stack

### Backend
- **Spring Boot 3.2.0**
- **Java 21**
- **SQLite Database**
- **JWT Authentication**
- **Spring Security**
- **JavaMail for Email**

### Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **shadcn/ui Components**
- **React Hook Form**

## Setup Instructions

### Prerequisites
- Java 21 or higher
- Node.js 18+ and npm
- Gmail account for email functionality

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GoalMate.git
   cd GoalMate/backend-springboot
   ```

2. **Configure Email (Required for email verification)**
   
   Create a `.env` file in `backend-springboot/` directory:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```
   
   **To get Gmail App Password:**
   - Enable 2-Factor Authentication on your Gmail
   - Go to Google Account Settings → Security → App Passwords
   - Generate a 16-character app password
   - Use this password in the `.env` file

3. **Run the backend**
   ```bash
   # Using Maven wrapper (Windows)
   .\mvnw spring-boot:run
   
   # Or using the batch file
   .\start.bat
   ```
   
   Backend will start on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Frontend will start on `http://localhost:5173`

## Usage

1. **Register a new account** - You'll receive an email verification link
2. **Verify your email** - Click the link in your email
3. **Login** - Use your credentials to access the dashboard
4. **Create tasks** - Add tasks with categories, priorities, and due dates
5. **Manage tasks** - Mark as complete, edit, or delete tasks
6. **View analytics** - Check your productivity insights

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /verify-email` - Verify email with token
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `POST /resend-verification` - Resend verification email

### Tasks (Requires Authentication)
- `GET /tasks` - Get user's tasks
- `POST /tasks` - Create new task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## Project Structure

```
GoalMate/
├── backend-springboot/
│   ├── src/main/java/com/goalmate/
│   │   ├── config/          # Security & CORS configuration
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data transfer objects
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data repositories
│   │   └── service/        # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── .env                # Email configuration (create this)
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/           # Utilities and API client
│   │   └── pages/         # Page components
│   └── package.json
└── README.md
```

## Security Features

- JWT-based authentication
- Password hashing with BCrypt
- Email verification for new accounts
- Secure password reset flow
- CORS protection
- Input validation

## Production Deployment

### Backend Production Setup
1. **Set environment variables** (see `.env.example`)
2. **Use production profile**: `java -jar -Dspring.profiles.active=prod goalmate-backend-1.0.0.jar`
3. **Configure database path** for persistent storage
4. **Update CORS origins** to your domain
5. **Use strong JWT secret** (minimum 32 characters)

### Frontend Production Build
1. **Update API URL** in `src/lib/api.ts`
2. **Build for production**: `npm run build`
3. **Deploy dist folder** to your web server

## Development Notes

- SQLite database file (`tasks.db`) is created automatically
- Email verification links work only when both frontend and backend are running
- For production, ensure all environment variables are properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).