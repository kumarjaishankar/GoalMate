# GoalMate Frontend

React TypeScript frontend for the GoalMate task management application.

## Prerequisites
- Node.js 18+ and npm

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Frontend will start on `http://localhost:5173`

## Production Build

1. **Update API URL**
   
   Edit `src/lib/api.ts` and change:
   ```typescript
   const API_BASE_URL = 'https://your-api-domain.com';
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Deploy**
   
   Deploy the `dist/` folder to your web server or CDN.

## Features

- Modern React 18 with TypeScript
- Responsive design with Tailwind CSS
- shadcn/ui component library
- Dark/Light theme support
- Form validation with React Hook Form
- Real-time password strength indicator
- Task management with analytics
- Email verification flow

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui Components
- React Hook Form
- React Router DOM
- Recharts for analytics