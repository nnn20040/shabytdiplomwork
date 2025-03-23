
# StudyHub Backend

This folder contains the backend implementation for the StudyHub platform.

## Structure

- `api/` - Contains API endpoints implementation
- `controllers/` - Business logic for handling API requests
- `models/` - Database models and schemas
- `middleware/` - Custom middleware functions
- `utils/` - Utility functions
- `services/` - Common services used across the application
- `config/` - Configuration files

## Setup Instructions

1. Install dependencies:
```
npm install
```

2. Set up environment variables:
```
cp .env.example .env
```

3. Start the development server:
```
npm run dev
```

## API Documentation

The API documentation will be available at `/api-docs` when the server is running.

## Authentication

The backend uses JSON Web Tokens (JWT) for authentication.

## Database

This application uses PostgreSQL as the primary database.
