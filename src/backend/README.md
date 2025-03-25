
# StudyHub Backend (Go Version)

This folder contains the Go backend implementation for the StudyHub platform.

## Structure

- `api/` - Contains API routes implementation
- `controllers/` - Business logic for handling API requests
- `models/` - Database models
- `middleware/` - Custom middleware functions
- `services/` - Common services used across the application
- `config/` - Configuration files

## Setup Instructions

1. Install Go (1.16 or higher)

2. Install dependencies:
```bash
go mod download
```

3. Set up environment variables in a .env file:
```
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ent_prep_db
DB_SSL=false
PORT=5000
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server:
```bash
go run main.go
```

## API Documentation

The API provides endpoints for:
- User authentication (register, login, password management)
- Course management (create, read, update, delete)
- AI Assistant (ask questions, view history)

## Authentication

The backend uses JSON Web Tokens (JWT) for authentication.

## Database

This application uses PostgreSQL as the primary database.
