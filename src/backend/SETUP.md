
# Shabyt Backend Setup

## Prerequisites
- Go 1.18 or higher
- PostgreSQL 12 or higher
- SMTP server access for email functionality

## Setup Instructions

### 1. Database Setup
1. Install PostgreSQL if you haven't already
2. Create a new database:
   ```
   createdb shabyt_db
   ```
3. Initialize the database schema:
   ```
   psql -d shabyt_db -f init_db.sql
   ```

### 2. Environment Configuration
1. Copy the provided `.env.example` file to `.env`
2. Update the configuration values in the `.env` file:
   - Set database credentials
   - Set a strong JWT secret
   - Configure email settings for password reset functionality

### 3. Installing Dependencies
Run the following command in the `src/backend` directory:
```
go mod tidy
```

### 4. Running the Server
Start the server with:
```
go run main.go
```

The server will be available at http://localhost:5000 by default.

## Using the API with a Mock Database

If you don't have PostgreSQL installed, you can use a mock database for testing:

1. Set the `USE_MOCK_DB=true` in your `.env` file
2. Run the server as usual

Note: The mock database will only have in-memory storage and will reset when the server restarts.

## Troubleshooting

- **Database Connection Issues**: Ensure PostgreSQL is running and the credentials in `.env` are correct
- **Email Sending Fails**: Check your SMTP configuration in `.env`
- **JWT Token Issues**: Make sure JWT_SECRET is set properly
