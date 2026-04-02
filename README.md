# WhatChat

A full-stack AI chat application with user authentication, persistent chat history, and multi-model AI support.

## Features

- **User Authentication** - Secure login/signup with JWT tokens
- **AI Chat** - Chat with AI using NVIDIA's API (supports multiple models like Kimi K2)
- **Chat Management** - Create, rename, and delete chat conversations
- **Persistent History** - All chats saved to MongoDB
- **Responsive UI** - Modern interface built with TailwindCSS
- **Markdown Support** - AI responses render with proper formatting and syntax highlighting

## Tech Stack

### Frontend
- **React 19** - UI library with hooks and context
- **Vite** - Fast build tool and dev server
- **TailwindCSS 4** - Utility-first styling
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **React Markdown + Syntax Highlighter** - Render AI responses
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - Server framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **OpenAI SDK** - AI API integration (NVIDIA base URL)
- **CORS + Cookie Parser** - Middleware

## Project Structure

```
proj2/
├── backend/
│   ├── src/
│   │   ├── api/           # Express app setup
│   │   ├── controllers/   # Business logic (chat, user)
│   │   ├── dbConnect/     # MongoDB connection
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── utils/         # AI response utility
│   │   └── index.js       # Server entry
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route definitions
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- NVIDIA API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd proj2
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Environment Setup

Create `.env` file in `backend/src/`:
```env
MONGO_URI="your_mongodb_connection_string"
DB_USERNAME="your_db_username"
DB_PASSWORD="your_db_password"
PORT=3000
JWT_SECRET="your_jwt_secret"
NVIDIA_API_KEY="your_nvidia_api_key"
```

Create `.env` file in `frontend/`:
```env
VITE_API_URL="http://localhost:3000"
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend dev server (in a new terminal):
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `GET /api/user/profile` - Get user profile
- `POST /api/user/logout` - Logout user

### Chat
- `POST /api/chat/create` - Create new chat
- `POST /api/chat/:chatId` - Send message to chat
- `GET /api/chat/:chatId` - Get specific chat
- `GET /api/chat/all` - Get all user chats
- `POST /api/chat/rename` - Rename chat
- `POST /api/chat/delete` - Delete chat

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## AI Models

The application uses NVIDIA's API with support for multiple models:
- `moonshotai/kimi-k2-instruct` (default)
- Other models available through NVIDIA's API

## Authentication Flow

1. User registers/logs in → receives JWT token (stored in HTTP-only cookie)
2. Token is verified on protected routes via `authUser` middleware
3. User data is attached to request (`req.user_id`)
4. Context API manages auth state in React

## Database Schema

### User
- `username` (String, unique)
- `email` (String, unique)
- `password` (String, hashed)
- `chats` (Array of Chat references)

### Chat
- `participant` (User reference)
- `title` (String, defaults to "New Chat")
- `messages` (Array of {prompt, response, createdAt})

## License

ISC

## Author

saif
