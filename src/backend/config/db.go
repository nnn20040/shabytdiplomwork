package config

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var db *sql.DB

// InitDB initializes the database connection
func InitDB() error {
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	sslMode := os.Getenv("DB_SSL")

	// Set default values if environment variables are not set
	if dbHost == "" {
		dbHost = "localhost"
	}
	if dbPort == "" {
		dbPort = "5432"
	}
	if dbUser == "" {
		dbUser = "postgres"
	}
	if dbName == "" {
		dbName = "shabyt4_db"
	}
	if sslMode == "" {
		sslMode = "disable"
	}

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, sslMode)

	log.Printf("Connecting to database: %s:%s/%s as %s", dbHost, dbPort, dbName, dbUser)

	var err error
	db, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		return err
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Test connection
	if err = db.Ping(); err != nil {
		log.Printf("Failed to ping database: %v", err)
		return err
	}

	log.Printf("Successfully connected to the database")
	return nil
}

// GetUserByEmail retrieves a user by email from the database
func GetUserByEmail(ctx context.Context, email string) (map[string]interface{}, error) {
	query := `
		SELECT id, email, password, first_name, last_name, 
		       first_name || ' ' || last_name as name, 
		       role, created_at, updated_at,
		       reset_token, reset_token_expiry
		FROM users
		WHERE email = $1
	`

	log.Printf("Looking up user with email: %s", email)

	row := db.QueryRowContext(ctx, query, email)
	
	var (
		id, password, firstName, lastName, name, role string
		createdAt, updatedAt                          time.Time
		resetToken                                    sql.NullString
		resetTokenExpiry                              sql.NullInt64
	)

	err := row.Scan(
		&id, &email, &password, &firstName, &lastName, &name, &role,
		&createdAt, &updatedAt, &resetToken, &resetTokenExpiry,
	)

	if err != nil {
		log.Printf("Database error looking up user by email: %v", err)
		return nil, err
	}

	log.Printf("Found user with email %s: ID=%s, Name=%s", email, id, name)

	userData := map[string]interface{}{
		"ID":        id,
		"Email":     email,
		"Password":  password,
		"FirstName": firstName,
		"LastName":  lastName,
		"Name":      name,
		"Role":      role,
		"CreatedAt": createdAt,
		"UpdatedAt": updatedAt,
	}

	if resetToken.Valid {
		userData["ResetToken"] = resetToken.String
	}

	if resetTokenExpiry.Valid {
		userData["ResetTokenExpiry"] = resetTokenExpiry.Int64
	}

	return userData, nil
}

// CreateUser creates a new user in the database
func CreateUser(ctx context.Context, firstName, lastName, email, password, role string) (map[string]interface{}, error) {
	name := firstName + " " + lastName

	query := `
		INSERT INTO users (first_name, last_name, name, email, password, role)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, email, first_name, last_name, name, role, created_at, updated_at
	`

	row := db.QueryRowContext(ctx, query, firstName, lastName, name, email, password, role)

	var (
		id        string
		retEmail  string
		retFirstName string
		retLastName string
		retName   string
		retRole   string
		createdAt time.Time
		updatedAt time.Time
	)

	err := row.Scan(&id, &retEmail, &retFirstName, &retLastName, &retName, &retRole, &createdAt, &updatedAt)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
			return nil, fmt.Errorf("user with this email already exists")
		}
		return nil, fmt.Errorf("error creating user: %w", err)
	}

	userData := map[string]interface{}{
		"ID":        id,
		"Email":     retEmail,
		"FirstName": retFirstName,
		"LastName":  retLastName,
		"Name":      retName,
		"Role":      retRole,
		"CreatedAt": createdAt,
		"UpdatedAt": updatedAt,
	}

	return userData, nil
}

// GetUserByID retrieves a user by ID from the database
func GetUserByID(ctx context.Context, id string) (map[string]interface{}, error) {
	query := `
		SELECT id, email, first_name, last_name, 
		       first_name || ' ' || last_name as name, 
		       role, created_at, updated_at
		FROM users
		WHERE id = $1
	`

	row := db.QueryRowContext(ctx, query, id)

	var (
		email     string
		firstName string
		lastName  string
		name      string
		role      string
		createdAt time.Time
		updatedAt time.Time
	)

	err := row.Scan(&id, &email, &firstName, &lastName, &name, &role, &createdAt, &updatedAt)
	if err != nil {
		return nil, fmt.Errorf("error getting user by ID: %w", err)
	}

	userData := map[string]interface{}{
		"ID":        id,
		"Email":     email,
		"FirstName": firstName,
		"LastName":  lastName,
		"Name":      name,
		"Role":      role,
		"CreatedAt": createdAt,
		"UpdatedAt": updatedAt,
	}

	return userData, nil
}

// UpdateUser updates user information in the database
func UpdateUser(ctx context.Context, id, firstName, lastName, email, role string) (map[string]interface{}, error) {
	name := firstName + " " + lastName

	query := `
		UPDATE users 
		SET first_name = $1, last_name = $2, name = $3, email = $4, role = $5, updated_at = NOW()
		WHERE id = $6
		RETURNING id, email, first_name, last_name, name, role, created_at, updated_at
	`

	row := db.QueryRowContext(ctx, query, firstName, lastName, name, email, role, id)

	var (
		retEmail  string
		retFirstName string
		retLastName string
		retName   string
		retRole   string
		createdAt time.Time
		updatedAt time.Time
	)

	err := row.Scan(&id, &retEmail, &retFirstName, &retLastName, &retName, &retRole, &createdAt, &updatedAt)
	if err != nil {
		return nil, fmt.Errorf("error updating user: %w", err)
	}

	userData := map[string]interface{}{
		"ID":        id,
		"Email":     retEmail,
		"FirstName": retFirstName,
		"LastName":  retLastName,
		"Name":      retName,
		"Role":      retRole,
		"CreatedAt": createdAt,
		"UpdatedAt": updatedAt,
	}

	return userData, nil
}

// ExecContext executes a query without returning any rows.
func ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	result, err := db.ExecContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %w", err)
	}
	return result, nil
}

// SaveResetToken saves a password reset token for a user
func SaveResetToken(ctx context.Context, id, resetToken string, resetTokenExpiry int64) error {
	query := `
		UPDATE users
		SET reset_token = $1, reset_token_expiry = $2
		WHERE id = $3
	`
	_, err := db.ExecContext(ctx, query, resetToken, resetTokenExpiry, id)
	if err != nil {
		return fmt.Errorf("error saving reset token: %w", err)
	}
	return nil
}

// VerifyResetToken verifies a password reset token
func VerifyResetToken(ctx context.Context, id, token string) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1
			FROM users
			WHERE id = $1
			AND reset_token = $2
			AND reset_token_expiry > EXTRACT(EPOCH FROM NOW())
		)
	`
	var exists bool
	err := db.QueryRowContext(ctx, query, id, token).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("error verifying reset token: %w", err)
	}
	return exists, nil
}

// ClearResetToken clears a user's password reset token
func ClearResetToken(ctx context.Context, id string) error {
	query := `
		UPDATE users
		SET reset_token = NULL, reset_token_expiry = NULL
		WHERE id = $1
	`
	_, err := db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("error clearing reset token: %w", err)
	}
	return nil
}
